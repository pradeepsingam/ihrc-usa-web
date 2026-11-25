<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\SubmissionConfirmation;
use App\Mail\SubmissionReceived;
use App\Models\Event;
use App\Models\FormDefinition;
use App\Models\FormSubmission;
use App\Services\FormSpec;
use App\Services\VirusScanner;
use App\Support\Mailboxes;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

/**
 * Receives every form on the website (see src/lib/submitForm.js in the React app):
 *   JSON:      { form, subject, submittedAt, data: { question: answer }, _hp }
 *   multipart: form, subject, submittedAt, data (JSON string), _hp + one file part per upload
 *
 * Requirements 3.3: receive → check → save with reference → email mailbox → auto-reply → respond.
 */
class FormController extends Controller
{
    /** Used for forms that are not in the Form Builder (they have no per-field rules). */
    public const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'bmp', 'doc', 'docx', 'odt', 'rtf', 'txt'];

    public const MAX_FILE_MB = 100;

    public function store(Request $request, VirusScanner $scanner): JsonResponse
    {
        $request->validate([
            'form' => ['required', 'string', 'max:1000'],
            'subject' => ['nullable', 'string', 'max:1000'],
        ]);

        // ---- Spam protection: hidden "honeypot" field must stay empty; bots fill it in.
        if (filled($request->input('_hp'))) {
            Log::info('Form spam blocked (honeypot)', ['ip' => $request->ip(), 'form' => $request->input('form')]);

            return response()->json(['ok' => true, 'reference' => 'IHRC-'.now()->format('Y').'-000000'], 201);
        }

        $data = $request->input('data');
        if (is_string($data)) {
            $data = json_decode($data, true);
        }
        if (! is_array($data) || $data === []) {
            return $this->error('Missing form data.');
        }
        $data = collect($data)->take(300)->mapWithKeys(fn ($v, $k) => [mb_substr((string) $k, 0, 500) => mb_substr(is_array($v) ? implode('; ', $v) : (string) $v, 0, 20000)])->all();

        // Link spam: lots of web links in the answers.
        $links = preg_match_all('#https?://#i', implode(' ', $data));
        if ($links > 8) {
            return $this->error('Your message contains too many web links.');
        }

        // Email addresses must look valid.
        foreach ($data as $question => $answer) {
            if ($answer !== '' && preg_match('/e-?mail/i', $question) && ! str_contains($answer, ' ') && str_contains($answer, '@') && ! filter_var($answer, FILTER_VALIDATE_EMAIL)) {
                return $this->error("Please enter a valid email address for \"$question\".");
            }
        }

        $form = mb_substr($request->input('form'), 0, 250);
        $uploads = collect($request->allFiles())->filter(fn ($f) => ! is_array($f));
        foreach ($uploads as $field => $file) {
            if (! $file->isValid()) {
                return $this->error("The file for '$field' could not be uploaded (it may be too large).");
            }
        }

        // ---- Required fields, email format and per-field file rules for Form Builder forms.
        $definition = FormDefinition::where('name', $form)->first();
        if ($definition) {
            $errors = FormSpec::validate(FormSpec::toWebsite($definition), $data, $uploads->all());
            if ($errors) {
                return $this->error($errors[0], $errors);
            }
        } else {
            foreach ($uploads as $field => $file) {
                if ($file->getSize() > self::MAX_FILE_MB * 1024 * 1024 || ! in_array(strtolower($file->getClientOriginalExtension()), self::ALLOWED_EXTENSIONS)) {
                    return $this->error("File '$field' must be a PDF, image or document up to ".self::MAX_FILE_MB.' MB.');
                }
            }
        }

        // ---- Save files privately and scan them for viruses.
        $files = [];
        foreach ($uploads as $field => $file) {
            $path = $file->store('submissions/'.now()->format('Y-m'), 'local');
            $scan = $scanner->scan(Storage::disk('local')->path($path));
            if ($scan === VirusScanner::INFECTED) {
                Storage::disk('local')->delete($path);
                foreach ($files as $f) {
                    Storage::disk('local')->delete($f['path']);
                }
                Log::warning('Infected upload rejected', ['form' => $form, 'field' => $field, 'ip' => $request->ip()]);

                return $this->error("The file for '$field' was rejected by the virus scanner.");
            }
            $files[$field] = ['name' => mb_substr($file->getClientOriginalName(), 0, 200), 'path' => $path, 'size' => $file->getSize(), 'scan' => $scan];
        }

        $mailbox = Mailboxes::keyFor($form);
        $submission = FormSubmission::create([
            'form' => $form,
            'subject' => mb_substr((string) $request->input('subject'), 0, 250) ?: null,
            'data' => $data,
            'files' => $files,
            'submitted_at' => now(),
            'status' => 'New',
            'mailbox' => $mailbox,
            'applicant_email' => $this->applicantEmail($data),
            'event_id' => $this->eventFor($form, $data),
            'ip' => $request->ip(),
        ])->refresh();

        // ---- Email the mailbox and send the applicant a confirmation.
        if ($to = Mailboxes::address($mailbox)) {
            try {
                Mail::to($to)->send(new SubmissionReceived($submission));
                $submission->forceFill(['mailed_at' => now()])->saveQuietly();
            } catch (\Throwable $e) {
                Log::warning('Form mailbox email failed for '.$submission->reference.': '.$e->getMessage());
            }
        }
        if ($submission->applicant_email) {
            try {
                Mail::to($submission->applicant_email)->send(new SubmissionConfirmation($submission));
                $submission->forceFill(['confirmation_sent_at' => now()])->saveQuietly();
            } catch (\Throwable $e) {
                Log::warning('Form applicant confirmation failed for '.$submission->reference.': '.$e->getMessage());
            }
        }

        return response()->json([
            'ok' => true,
            'id' => $submission->id,
            'reference' => $submission->reference,
            'confirmationSent' => (bool) $submission->confirmation_sent_at,
            'message' => $definition?->success_message,
        ], 201);
    }

    protected function error(string $message, array $errors = []): JsonResponse
    {
        return response()->json(['ok' => false, 'message' => $message, 'errors' => $errors], 422);
    }

    /** The first answer to a question about email that holds a valid address. */
    protected function applicantEmail(array $data): ?string
    {
        foreach ($data as $q => $a) {
            if (preg_match('/e-?mail/i', $q) && filter_var(trim($a), FILTER_VALIDATE_EMAIL)) {
                return trim($a);
            }
        }

        return null;
    }

    /** Event registrations are linked to their event so admins can see registrations per event. */
    protected function eventFor(string $form, array $data): ?int
    {
        if (stripos($form, 'Event Registration') !== 0) {
            return null;
        }
        $title = trim($data['Event'] ?? '') ?: trim(substr($form, strlen('Event Registration:')));

        return $title ? Event::where('title', $title)->value('id') : null;
    }
}

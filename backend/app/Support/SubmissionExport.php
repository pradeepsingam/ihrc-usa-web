<?php

namespace App\Support;

use App\Models\FormSubmission;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Collection;

class SubmissionExport
{
    public static function csv(Collection $submissions)
    {
        $questions = $submissions->flatMap(fn ($s) => array_keys($s->data ?? []))->unique()->values()->all();
        $columns = ['Reference', 'Form', 'Status', 'Received', 'Subject', 'Applicant email', ...$questions, 'Files', 'Notes'];
        $rows = $submissions->map(fn (FormSubmission $s) => [
            'Reference' => $s->reference, 'Form' => $s->form, 'Status' => $s->status,
            'Received' => $s->submitted_at?->format('Y-m-d H:i'), 'Subject' => $s->subject,
            'Applicant email' => $s->applicant_email, 'Notes' => $s->notes,
            'Files' => collect($s->files ?? [])->map(fn ($f, $k) => "$k: ".$f['name'])->implode('; '),
        ] + ($s->data ?? []));

        return Csv::download('submissions-'.now()->format('Y-m-d-His').'.csv', $columns, $rows);
    }

    public static function pdf(FormSubmission $s)
    {
        return response()->streamDownload(
            fn () => print (Pdf::loadView('pdf.submission', ['s' => $s])->setPaper('a4')->output()),
            ($s->reference ?: 'submission-'.$s->id).'.pdf',
            ['Content-Type' => 'application/pdf'],
        );
    }
}

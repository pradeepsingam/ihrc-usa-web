@extends('mail.layout')
@section('body')
<p style="margin:0 0 4px;color:#64748b;font-size:13px">New website submission</p>
<h2 style="margin:0 0 12px;font-size:20px">{{ $submission->form }}</h2>
<p style="margin:0 0 16px">Reference <strong>{{ $submission->reference }}</strong> · received {{ $submission->submitted_at?->format('d M Y H:i') }}</p>
<table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px">
@foreach ($submission->data ?? [] as $question => $answer)
<tr><td style="border:1px solid #e2e8f0;background:#f8fafc;width:40%;vertical-align:top">{{ $question }}</td><td style="border:1px solid #e2e8f0;white-space:pre-line;vertical-align:top">{{ $answer }}</td></tr>
@endforeach
</table>
@if (! empty($submission->files))
<p style="margin:16px 0 4px"><strong>Uploaded files</strong> (open them in the admin panel):</p>
<ul style="margin:0;padding-left:18px">@foreach ($submission->files as $key => $f)<li>{{ $key }}: {{ $f['name'] }}@if(($f['scan'] ?? null) && $f['scan'] !== 'clean') <em>({{ $f['scan'] }})</em>@endif</li>@endforeach</ul>
@endif
<p style="margin:20px 0 0"><a href="{{ url('/admin/form-submissions/'.$submission->id) }}" style="background:#0b2e6b;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none">Open in admin</a></p>
@endsection
@section('footer') Sent to the {{ $submission->mailbox }} mailbox @endsection

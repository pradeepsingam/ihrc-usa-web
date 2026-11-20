<!doctype html>
<html><head><meta charset="utf-8"><style>
body{font-family:DejaVu Sans,sans-serif;font-size:11px;color:#0f172a}
h1{font-size:18px;margin:0 0 4px;color:#0b2e6b} .muted{color:#64748b}
table{width:100%;border-collapse:collapse;margin-top:12px} td{border:1px solid #cbd5e1;padding:6px;vertical-align:top}
td.q{width:38%;background:#f1f5f9} .notes{white-space:pre-line;border:1px solid #cbd5e1;padding:8px;margin-top:8px}
</style></head><body>
<p class="muted">IHRC-USA · Form submission</p>
<h1>{{ $s->form }}</h1>
<p><strong>Reference:</strong> {{ $s->reference }} &nbsp; <strong>Status:</strong> {{ $s->status }} &nbsp; <strong>Received:</strong> {{ $s->submitted_at?->format('d M Y H:i') }}</p>
@if($s->subject)<p><strong>Subject:</strong> {{ $s->subject }}</p>@endif
<table>@foreach($s->data ?? [] as $q => $a)<tr><td class="q">{{ $q }}</td><td style="white-space:pre-line">{{ $a }}</td></tr>@endforeach</table>
@if(! empty($s->files))<p style="margin-top:12px"><strong>Uploaded files:</strong> @foreach($s->files as $k => $f){{ $k }}: {{ $f['name'] }}@if(! $loop->last), @endif @endforeach</p>@endif
@if($s->notes)<p style="margin-top:12px"><strong>Notes</strong></p><div class="notes">{{ $s->notes }}</div>@endif
<p class="muted" style="margin-top:16px">Printed {{ now()->format('d M Y H:i') }}</p>
</body></html>

@extends('mail.layout')
@section('body')
<h2 style="margin:0 0 16px;font-size:20px">{{ $newsletter->subject }}</h2>
<div>{!! app(\Symfony\Component\HtmlSanitizer\HtmlSanitizerInterface::class)->sanitize($newsletter->body) !!}</div>
@endsection
@section('footer') You receive this because you subscribed on our website. <a href="{{ route('unsubscribe', $subscriber->token) }}" style="color:#64748b">Unsubscribe</a> @endsection

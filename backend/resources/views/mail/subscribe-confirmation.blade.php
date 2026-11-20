@extends('mail.layout')
@section('body')
<p>Hello{{ $subscriber->name ? ' '.$subscriber->name : '' }},</p>
<p>Please confirm that you want to receive news and updates from IHRC-USA.</p>
<p style="margin:20px 0"><a href="{{ route('subscribe.confirm', $subscriber->token) }}" style="background:#0b2e6b;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">Confirm my subscription</a></p>
<p style="color:#64748b;font-size:13px">If you did not ask for this, ignore this email and you will not be subscribed.</p>
@endsection
@section('footer') <a href="{{ route('unsubscribe', $subscriber->token) }}" style="color:#64748b">Unsubscribe</a> @endsection

@extends('mail.layout')
@section('body')
<p>Hello{{ $subscriber->name ? ' '.$subscriber->name : '' }},</p>
<p>Thank you for subscribing. You are now subscribed to news and updates from IHRC-USA.</p>
<p>No confirmation is needed. You can unsubscribe at any time using the link below.</p>
@endsection
@section('footer') <a href="{{ route('unsubscribe', $subscriber->token) }}" style="color:#64748b">Unsubscribe</a> @endsection

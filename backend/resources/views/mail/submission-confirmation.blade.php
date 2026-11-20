@extends('mail.layout')
@section('body')
<p>Dear applicant,</p>
<p>Thank you. We have received your <strong>{{ $submission->form }}</strong>.</p>
<p style="font-size:17px">Your reference number is <strong>{{ $submission->reference }}</strong>.</p>
<p>Please keep this number and quote it if you contact us about your submission. Our team will review it and get back to you.</p>
<p>If you have questions, simply reply to this email.</p>
@endsection
@section('footer') You received this email because this address was entered in a form on our website. @endsection

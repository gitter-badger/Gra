@extends('emails.template')


@section('content')

	<h2>@lang('email.verification.title')</h2>
	<p>@lang('email.verification.content', ['link' => route('user.verify', ['token' => $token])])</p>


@endsection
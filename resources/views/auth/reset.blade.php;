@extends('app')

@section('content')

<div class="panel panel-default">
	<div class="panel-body">
		{!! BootForm::open()->post() !!}
		{!! BootForm::token() !!}

		{!! BootForm::hidden('token')->value($token) !!}
		{!! BootForm::email(trans('user.email'), 'email')->required() !!}
		{!! BootForm::password(trans('user.password'), 'password')->required() !!}
		{!! BootForm::password(trans('user.passwordConfirmation'), 'password_confirmation')->required() !!}
		{!! BootForm::submit(trans('action.remind'), 'btn-primary') !!}

		{!! BootForm::close() !!}
	</div>
</div>

@endsection
@extends('app')


@section('content')

<div class="panel panel-default">
	<div class="panel-body">

		{!! BootForm::open()->post()->action(route('user.register')) !!}
		{!! BootForm::token() !!}

		{!! BootForm::staticInput(trans('user.email'))->value($email) !!}
		{!! BootForm::password(trans('user.password'), 'r_password')->required() !!}
		{!! BootForm::password(trans('user.passwordConfirmation'), 'r_password_confirmation')->required() !!}

		{!! BootForm::checkbox(trans('user.rules'), 'r_rules')->required() !!}
		{!! BootForm::checkbox(trans('user.news'), 'r_news')->checked() !!}

		{!! BootForm::submit(trans('action.register'), 'btn-primary')->addClass('center-block') !!}
		{!! BootForm::close() !!}

	</div>
</div>


@endsection
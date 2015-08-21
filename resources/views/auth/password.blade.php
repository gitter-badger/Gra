@extends('app')



@section('content')

<div class="panel panel-default">
	<div class="panel-body">
		{!! BootForm::open()->post()->action(url('/auth/password/email')) !!}
		{!! BootForm::token() !!}

		{!! BootForm::email(trans('user.email'), 'email')->required() !!}
		{!! BootForm::submit(trans('action.reset'), 'btn-primary') !!}

		{!! BootForm::close() !!}

	</div>
</div>

@endsection
@extends('app')

@section('content')


<div class="panel panel-default">
	<div class="panel-body">

		{!! BootForm::open()->post() !!}
		{!! BootForm::token() !!}

		{!! BootForm::email(trans('user.email'), 'email')->required() !!}


		<div class="btn-group">
			<a href="{{ route('home') }}" class="btn btn-default"><span class="glyphicon glyphicon-arrow-left"></span></a>
			{!! BootForm::submit(trans('action.resendVerification'), 'btn-primary') !!}
		</div>

		{!! BootForm::close() !!}
	
	</div>
</div>

@endsection
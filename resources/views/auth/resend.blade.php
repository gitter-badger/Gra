@extends('app')

@section('content')

{!! BootForm::open()->post() !!}
{!! BootForm::token() !!}

{!! BootForm::email('email', trans('user.email'))->required() !!}


<div class="btn-group">
	<a href="{{ route('home') }}" class="btn btn-default"><span class="glyphicon glyphicon-arrow-left"></span></a>
	{!! BootForm::submit(trans('action.resendVerification'), 'btn-primary') !!}
</div>

{!! BootForm::close() !!}


@endsection
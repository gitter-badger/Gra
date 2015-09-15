@extends('app')

@section('content')

<div class="row">
	<div class="col-xs-6 col-xs-offset-3">
		
		<div class="panel panel-default">
			<div class="panel-body">

				{!! BootForm::open()->post() !!}
				{!! BootForm::token() !!}

				{!! BootForm::email('email', trans('user.email'))->required() !!}


				<div class="btn-group">
					<a href="{{ route('home') }}" class="btn btn-default"><span class="glyphicon glyphicon-arrow-left"></span></a>
					{!! BootForm::submit(trans('action.resendVerification'), 'btn-primary') !!}
				</div>

				{!! BootForm::close() !!}
			
			</div>
		</div>
	</div>
</div>



@endsection
@extends('app')

@section('content')

<div class="row">

	<div class="col-md-4">

		<div class="panel panel-default">
			<div class="panel-body">

				@include('form.user.login')
			</div>
		</div>
	</div>
	<div class="col-md-8">

		<div class="panel panel-default">
			<div class="panel-body">
	
				@include('form.user.register')
			</div>
		</div>
	</div>
</div>



@endsection
@extends('app')


@section('scripts')

@parent
<script src="//fortumo.com/javascripts/fortumopay.js" type="text/javascript"></script>

@endsection

@section('content')

<div class="panel panel-default">
	<div class="panel-heading">
	
		<h3>@lang('navigation.premiumShop')
	</div>

	<div class="panel-body text-center">

 
 		<div class="row equalize">
			@include('payment.fortumo')

			@include('payment.transferuj')
		</div>
	</div>
</div>

@endsection
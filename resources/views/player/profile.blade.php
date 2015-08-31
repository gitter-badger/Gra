@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-body">

		<div class="row">
			<div class="col-xs-6 col-xs-offset-3">
				
				<img src="{{ $target->avatar }}" class="img-full center-block"/>

				<div class="well text-center">
					
					<h4>{{ $target->name }}</h4>
					<p><strong>@lang('statistic.level'): </strong> {{ $target->level }}</p>
					<p><strong>@lang('statistic.plantatorLevel'): </strong> {{ $target->plantatorLevel }}</p>
					<p><strong>@lang('statistic.smugglerLevel'): </strong> {{ $target->smugglerLevel }}</p>
					<p><strong>@lang('statistic.dealerLevel'): </strong> {{ $target->dealerLevel }}</p>
					<p><strong>@lang('statistic.respect'): </strong> {{ $target->respect }}</p>

				</div>
			</div>
		</div>



	</div>
</div>

@endsection
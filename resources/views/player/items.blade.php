@extends('player.base')


@section('tab-content')

<div class="well">

	<div class="row">

		<div class="col-xs-4 col-sm-2 col-sm-offset-3">

			@if(isset($armor))

				<div class="btn btn-default btn-block inactive" data-toggle="tooltip" title="@include('details.item', ['image' => false, 'item' => $armor])">
					<img class="img-responsive" src="{{ $armor->getImage() }}"/>
				</div>
			@else

				<div class="btn btn-default btn-block inactive square"></div>
			@endif
		</div>

		<div class="col-xs-4 col-sm-2">

			@if(isset($weapon))

				<div class="btn btn-default btn-block inactive" data-toggle="tooltip" title="@include('details.item', ['image' => false, 'item' => $weapon])">
					<img class="img-responsive" src="{{ $weapon->getImage() }}"/>
				</div>
			@else

				<div class="btn btn-default btn-block inactive square"></div>
			@endif
		</div>

		<div class="col-xs-4 col-sm-2">

			@if(isset($vehicle))

				<div class="btn btn-default btn-block inactive" data-toggle="tooltip" title="@include('details.item', ['image' => false, 'item' => $vehicle])">
					<img class="img-responsive" src="{{ $vehicle->getImage() }}"/>
				</div>
			@else

				<div class="btn btn-default btn-block inactive square"></div>
			@endif

		</div>

	</div>

	<hr/>

	<div class="row equalize">

	@forelse($items as $item)

		<?php $requirements = $item->getRequirements(); ?>

		<div class="col-xs-6 col-sm-3 col-md-2{{ $requirements->check() ? '' : ' disabled' }}">
			
			@if($item->isUsable())

				{!! BootForm::open()->post()->action(route('player.use')) !!}
				{!! BootForm::token() !!}
				{!! BootForm::hidden('item')->value($item->getId()) !!}
				{!! BootForm::hidden('type')->value($item->getType()) !!}

				
				<button type="submit" class="btn btn-default btn-block" data-toggle="tooltip" title="@include('details.item', ['image' => false])">
					

					<img class="img-responsive" src="{{ $item->getImage() }}"/>
				</button>


				{!! BootForm::close() !!}
			@else

				<div class="btn btn-default btn-block inactive" data-toggle="tooltip" title="@include('details.item', ['image' => false])">
					<img class="img-responsive" src="{{ $item->getImage() }}"/>
				</div>
			@endif


		</div>

	@empty


		<div class="col-xs-12 text-center">
	
			<h4>@lang('player.empty')</h4>

		</div>

	@endforelse
	</div>
</div>

@endsection
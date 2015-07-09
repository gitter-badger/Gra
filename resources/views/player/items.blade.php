@extends('player.base')


@section('tab-content')

<div class="well">
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
	
			<h4>@lang('player.itemsEmpty')</h4>

		</div>

	@endforelse
	</div>
</div>

@endsection
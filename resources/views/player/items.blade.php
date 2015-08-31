@extends('player.base')


@section('tab-content')

<div class="well">


	<div class="row">
		<div class="col-xs-12 col-sm-6">
			
			<img class="img-full center-block" src="{{ $player->avatar }}"/>
		</div>
		<div class="col-xs-12 col-sm-6">
			
			<div class="row">

				<div class="col-xs-4 col-sm-12">

					<div class="panel panel-default">
						<div class="panel-body">

							@if(isset($armor))

								@include('details.item', ['generalDetails' => false, 'item' => $armor])

							@else

								<p class="text-center"><strong>@lang('player.noArmor')</strong></p>
							@endif
						</div>
					</div>
				</div>

				<div class="col-xs-4 col-sm-12">

					<div class="panel panel-default">
						<div class="panel-body">

							@if(isset($weapon))

								@include('details.item', ['generalDetails' => false, 'item' => $weapon])

							@else

								<p class="text-center"><strong>@lang('player.noWeapon')</strong></p>
							@endif
						</div>
					</div>
				</div>

				<div class="col-xs-4 col-sm-12">

					<div class="panel panel-default">
						<div class="panel-body">

							@if(isset($vehicle))

								@include('details.item', ['generalDetails' => false, 'item' => $vehicle])

							@else

								<p class="text-center"><strong>@lang('player.noVehicle')</strong></p>
							@endif
						</div>
					</div>
				</div>

			</div>


		</div>
	</div>

	<br/>

	<div class="row">

		@foreach($items as $item)

		<div class="col-xs-6 col-sm-4 col-md-2">

			@if($item->isUsable())

			{!! BootForm::open()->post() !!}
			{!! BootForm::token() !!}
			{!! BootForm::hidden('item')->value($item->getId()) !!}
			{!! BootForm::hidden('type')->value($item->getType()) !!}

			<button type="submit">
			@endif

			<div class="panel panel-default">
				<div class="panel-body" data-toggle="tooltip" title="@include('details.item', ['image' => false])">

					<img class="img-responsive center-block" src="{{ $item->getImage() }}"/>
				</div>
			</div>

			@if($item->isusable())
			</button>
			{!! BootForm::close() !!}

			@endif
		</div>


		@endforeach
	</div>

</div>

@endsection
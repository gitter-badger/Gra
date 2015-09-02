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

			<div class="item panel panel-default">
				<div class="item-popover">

					<?php $hr = false; ?>

					@if($item->isUsable())

						<?php $hr = true; ?>

						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}

						{!! BootForm::hidden('action')->value('use') !!}
						{!! BootForm::hidden('item')->value($item->getId()) !!}
						{!! BootForm::hidden('type')->value($item->getType()) !!}

						{!! BootForm::submit(trans('action.use'), 'btn-success')->addClass('btn-block') !!}

						{!! BootForm::close() !!}
					@else

						<?php $hr = false; ?>
					@endif

					@if($hr)

						<hr/>
					@endif

					@if($item->isEquipable())

						<?php $hr = true; ?>

						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}

						{!! BootForm::hidden('action')->value('equip') !!}
						{!! BootForm::hidden('item')->value($item->getId()) !!}
						{!! BootForm::hidden('type')->value($item->getType()) !!}

						{!! BootForm::submit(trans('action.equip'), 'btn-success')->addClass('btn-block') !!}

						{!! BootForm::close() !!}
					@else

						<?php $hr = false; ?>
					@endif

					@if($hr)
					
						<hr/>
					@endif


					{!! BootForm::open()->post() !!}
					{!! BootForm::token() !!}

					{!! BootForm::hidden('action')->value('drop') !!}
					{!! BootForm::hidden('item')->value($item->getId()) !!}
					{!! BootForm::hidden('type')->value($item->getType()) !!}

					@if($item->getCount() > 1)


						<input type="number" class="form-control" name="count"
							value="1" min="1" max="{{ $item->getCount() }}">
					@else

						{!! BootForm::hidden('count')->value(1) !!}
					@endif

					{!! BootForm::submit(trans('action.drop'), 'btn-danger')->addClass('btn-block') !!}

					{!! BootForm::close() !!}



				</div>

				<div class="panel-body" data-toggle="tooltip" title="@include('details.item', ['image' => false])">

					<img class="img-responsive center-block" src="{{ $item->getImage() }}"/>
				</div>
			</div>
		</div>


		@endforeach
	</div>

</div>

@endsection


@section('scripts')
@parent

<script type="text/javascript">
	
$(function() {

	$('.item').each(function() {

		$(this).popover({

			html: true,
			placement: 'right auto',
			title: '@lang('item.actions.title')',
			content: $(this).find('.item-popover').html(),
		});
	});
});



</script>


@endsection
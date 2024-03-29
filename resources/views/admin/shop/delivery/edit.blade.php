@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">
		
		@if(isset($delivery))

		<h2>Dostawa {{ $delivery->shop->name }} #{{  $delivery->id }} -- Edycja</h2>
		@else

		<h2>Nowa dostawa</h2>

		@endif
	</div>

	<div class="panel-body">


		@if(isset($delivery))

			{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.shop.delivery.update', ['shop' => $delivery->shop->id, 'delivery' => $delivery->id])) !!}
		@else

			{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.shop.delivery.store', ['shop' => $shop->id])) !!}
		@endif



		@if(isset($delivery))

		{!! BootForm::staticInput('<strong>Sklep</strong>')->value($delivery->shop->name) !!}
		@else

		{!! BootForm::staticInput('<strong>Sklep</strong>')->value($shop->name) !!}
		@endif




		<?php $types = ['weapon', 'armor', 'food', 'seed', 'stuff', 'vehicle']; ?>

		<?php $typeSelect = BootForm::select('<strong>Typ przedmiotu</strong>', 'type')->id('item-type'); ?>

		@foreach($types as $type)

		<?php $typeSelect->addOption($type, trans('item.types.' . $type)); ?>


		@endforeach


		@if(isset($delivery))

		<?php $typeSelect->defaultValue($delivery->item->getType()); ?>

		@endif

		{!! $typeSelect !!}


		@foreach($types as $type)

			<?php 
			$variable = $type . 's';

			$select = BootForm::select('<strong>Przedmiot</strong>', 'item_' . $type)->addClass('item')->data('type', $type);

			foreach($$variable as $item)
			{
				$select->addOption($item->id, $item->getTitle() . ' (' . $item->getName() . ')');
			}


			if(isset($delivery) && $delivery->item->getType() == $type)
			{
				$select->defaultValue($delivery->item->id);
			}

			echo $select;

			?>

		@endforeach

		
		{!! BootForm::number('<strong>Ilość</strong>', 'count')->min(1)->defaultValue(isset($delivery) ? $delivery->count : 1) !!}





		<div class="col-xs-offset-4">

			@if(isset($delivery))

				<a class="btn btn-danger" href="{{ route('admin.shop.delivery.show', ['shop' => $delivery->shop->id, 'delivery' => $delivery->id]) }}">
					{!! entity('icon')->icon('remove') !!}
				</a>
			@else

				<a class="btn btn-danger" href="{{ route('admin.shop.show', ['shop' => $shop->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
			@endif

			<button type="submit" class="btn btn-success">

				{!! entity('icon')->icon('ok') !!}
			</button>

		</div>


	{!! BootForm::close() !!}


	</div>
</div>

@endsection


@section('scripts')

@parent

<script type="text/javascript">

$(function() {


	$('#item-type').change(function() {

		var type = $(this).val();

		$('.item').each(function() {

			if($(this).data('type') == type) {

				$(this).parents('.form-group').show();
			}
			else {

				$(this).parents('.form-group').hide();
			}
		});


	}).trigger('change');
});

</script>


@endsection
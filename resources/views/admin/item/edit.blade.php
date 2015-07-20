@extends('app')


@section('content')

<div class="panel panel-default">
	<div class="panel-heading">

		@if(isset($item))

			<h2>{{ $item->getTitle() }} -- Edycja</h2>
		@else
		
			<h2>Nowy przedmiot</h2>
		@endif
	</div>

	<div class="panel-body">

		@if(isset($item))

			{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.item.' . $type . '.update', [$type => $item->id]))->enctype('multipart/form-data') !!}
		@else

			{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.item.' . $type . '.store'))->enctype('multipart/form-data') !!}
		@endif


		{!! BootForm::text('<strong>Surowa nazwa</strong>', 'name')->defaultValue(isset($item) ? $item->getName() : null)->required() !!}


		<?php $image = BootForm::image('<strong>Obrazek</strong>', 'image')->defaultValue(isset($item) ? $item->getImage() : null); ?>

		@if(!isset($item))

			<?php $image->required(); ?>
		@endif

		{!! $image !!}

		@if(isset($item))

		{!! BootForm::staticInput('<strong>Typ</strong>')->value(trans('item.types.' . $item->getType()))->attribute('value', $item->getType())->addClass('item-type') !!}

		@else

		{!! BootForm::staticInput('<strong>Typ</strong>')->value(trans('item.types.' . $type))->attribute('value', $type)->addClass('item-type') !!}

		@endif


		{!! BootForm::number('<strong>Cena</strong>', 'price')->defaultValue(isset($item) ? $item->getPrice() : 0)
			->min(1)->max(100000000) !!}


		<?php $checkbox = BootForm::checkbox('<strong>Premium</strong>', 'premium'); ?>
		
		@if(isset($item) && $item->isPremium())

			<?php $checkbox->check(); ?>
		@endif

		{!! $checkbox !!}

		{!! BootForm::number('<strong>Waga</strong>', 'weight')->defaultValue(isset($item) ? $item->getWeight() : 0) !!}


		{!! BootForm::staticInput('<strong>Wymagania - przykład</strong>')
			->value(\HempEmpire\Requirements::getConfig()) !!}

		{!! BootForm::textarea('<strong>Wymagania</strong>', 'requires')
			->value(isset($item) ? Formatter::stringify(array_get($item->properties, 'requires', []), false, false, PHP_EOL) : null) !!}











		@if($type == 'weapon')

			@include('admin.item.weapon.edit')

		@elseif($type == 'armor')

			@include('admin.item.armor.edit')

		@elseif($type == 'food')

			@include('admin.item.food.edit')

		@elseif($type == 'seed')

			@include('admin.item.seed.edit')

		@elseif($type == 'stuff')

			@include('admin.item.stuff.edit')

		@elseif($type == 'vehicle')

			@include('admin.item.vehicle.edit')

		@endif

		<div class="col-xs-offset-4">

			@if(isset($item))

				<a class="btn btn-danger" href="{{ route('admin.item.' . $type . '.show', [$type => $item->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
			@else

				<a class="btn btn-danger" href="{{ route('admin.item.' . $type . '.index') }}">{!! entity('icon')->icon('remove') !!}</a>
			@endif

			<button type="submit" class="btn btn-success">

				{!! entity('icon')->icon('ok') !!}
			</button>

		</div>

		{!! BootForm::close() !!}

	</div>
</div>


@endsection


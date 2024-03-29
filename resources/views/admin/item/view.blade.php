@extends('app')


@section('content')

<div class="panel panel-default">
	<div class="panel-heading">
		<h2>{{ $item->getTitle() }} -- Podgląd</h2>
	</div>

	<div class="panel-body">

		{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}


			
		{!! BootForm::staticInput('<strong>Nazwa surowa</strong>')->value($item->getName()) !!}
		{!! BootForm::staticInput('<strong>Nazwa wywietlana</strong>')->value($item->getTitle()) !!}
		{!! BootForm::staticInput('<strong>Opis</strong>')->value($item->getDescription()) !!}
		{!! BootForm::staticInput('<strong>Typ</strong>')->value(trans('item.types.' . $item->getType())) !!}

		<?php $image = '<img class="img-responsive center-block" src="' . $item->getImage() . '"/>'; ?>

		{!! BootForm::staticInput('<strong>Obrazek</strong>')->value($image) !!}

		<?php $price = $item->getPrice();
		$price = $item->isPremium() ? $price . 'pp' : '$' . $price; ?>


		{!! BootForm::staticInput('<strong>Waga</strong>')->value($item->getWeight()) !!}
		{!! BootForm::staticInput('<strong>Cena</strong>')->value($price) !!}
		{!! BootForm::staticInput('<strong>Premium</strong>')->value(Formatter::boolean($item->isPremium())) !!}

		{!! BootForm::staticInput('<strong>Wymagania</strong>')->value($item->getRequirements()->rawRender()) !!}


		@if($type == 'weapon')

			@include('admin.item.weapon.view')

		@elseif($type == 'armor')

			@include('admin.item.armor.view')

		@elseif($type == 'food')

			@include('admin.item.food.view')

		@elseif($type == 'seed')

			@include('admin.item.seed.view')

		@elseif($type == 'stuff')

			@include('admin.item.stuff.view')

		@elseif($type == 'vehicle')

			@include('admin.item.vehicle.view')

		@endif

		{!! BootForm::close() !!}

		<div class="col-xs-offset-4">

			<a href="{{ route('admin.item.' . $type . '.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
			<a href="{{ route('admin.item.' . $type . '.edit', [$type => $item->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

			{!! BootForm::open()->delete()->action(route('admin.item.' . $type . '.destroy', [$type => $item->id]))->addClass('form-inline') !!}
			{!! BootForm::token() !!}

			{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

			{!! BootForm::close() !!}
		</div>
	</div>
</div>


@endsection
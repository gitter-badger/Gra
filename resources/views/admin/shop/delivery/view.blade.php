@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">
		
		<h2>Dostawa {{ $delivery->shop->name }} #{{  $delivery->id }} -- Podgląd</h2>
	</div>

	<div class="panel-body">


	{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}


	<?php $type = $delivery->item->getType(); ?>
	{!! BootForm::staticInput('<strong>Przedmiot</strong>')->value('<a href="' . route('admin.item.' . $type . '.show', [$type => $delivery->item->id]) . '">' . 
		$delivery->item->getTitle() . ' (' . $delivery->item->getName() . ')</a>') !!}
	{!! BootForm::staticInput('<strong>Ilość</strong>')->value($delivery->count) !!}
	{!! BootForm::staticInput('<strong>Sklep</strong>')->value($delivery->shop->name) !!}




	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.shop.show', ['shop' => $delivery->shop->id]) }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.shop.delivery.edit', ['shop' => $delivery->shop->id, 'delivery' => $delivery->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

		{!! BootForm::open()->delete()->action(route('admin.shop.delivery.destroy', ['shop' => $delivery->shop->id, 'delivery' => $delivery->id]))->addClass('form-inline') !!}
		{!! BootForm::token() !!}

		{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

		{!! BootForm::close() !!}
	</div>

	</div>
</div>

@endsection
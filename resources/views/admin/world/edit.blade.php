@extends('app')


@section('content')


<div class="panel panel-default">

	<div class="panel-heading">

		<h2>@lang('world.' . $world->id) -- Edycja</h2>
	</div>

	<div class="panel-body">

	{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.world.update', ['world' => $world->id])) !!}

	
	{!! BootForm::staticInput('<strong>Nazwa</strong>')
		->value(trans('world.' . $world->id)) !!}
	
	{!! BootForm::staticInput('<strong>Populacja</strong>')
		->value($world->population) !!}


	<?php

	$checkbox = BootForm::checkbox('<strong>Otwarty</strong>', 'open');

	if($world->open)
		$checkbox->check();


	echo $checkbox;

	?>


	<div class="col-xs-offset-4">

		<a class="btn btn-danger" href="{{ route('admin.world.show', ['world' => $world->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
		<button type="submit" class="btn btn-success">

			{!! entity('icon')->icon('ok') !!}
		</button>

	</div>

	{!! BootForm::close() !!}

	

	</div>
</div>

@endsection
@extends('app')


@section('content')


<div class="panel panel-default">

	<div class="panel-heading">

		<h2>{{ $location->getTitle() }} -- Podgląd</h2>
	</div>

	<div class="panel-body">


	{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}

	<h3 class="text-center">Ogólne</h3>

	{!! BootForm::staticInput('<strong>Nazwa surowa</strong>')->value($location->getName()) !!}
	{!! BootForm::staticInput('<strong>Nazwa wywietlana</strong>')->value($location->getTitle()) !!}

	<?php $image = '<img class="img-responsive center-block" src="' . $location->getImage() . '"/>'; ?>

	{!! BootForm::staticInput('<strong>Obrazek</strong>')->value($image) !!}


	{!! BootForm::staticInput('<strong>Pozycja X</strong>', 'x')->value($location->x) !!}
	{!! BootForm::staticInput('<strong>Pozycja Y</strong>', 'y')->value($location->y) !!}

	<?php $groups = isset($location) ? implode(', ', $location->groups) : ''; ?>

	{!! BootForm::staticInput('<strong>Klasy</strong>', 'groups')->value(strlen($groups) > 0 ? $groups : '<span class="text-muted">brak</span>') !!}






	<?php $list = '<ul class="list-group">'; ?>
	@foreach($location->places as $place)


		<?php $list .= '<li class="list-group-item"><a href="' . route('admin.place.show', ['place' => $place->place_id]) . '">'
			. $place->getTitle() . ' (' . $place->getName() . ')</a></li>'; ?>

	@endforeach
	<?php $list .= '</ul>'; ?>

	{!! BootForm::staticInput('<strong>Miejsca</strong>')->value($list) !!}




	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.location.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.location.edit', ['location' => $location->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

		{!! BootForm::open()->delete()->action(route('admin.location.destroy', ['location' => $location->id]))->addClass('form-inline') !!}
		{!! BootForm::token() !!}

		{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

		{!! BootForm::close() !!}
	</div>

	</div>
</div>

@endsection
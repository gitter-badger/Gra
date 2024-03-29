@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">
		
		<h2>{{ $place->getTitle() }} -- Podgląd</h2>
	</div>

	<div class="panel-body">


	{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}


	{!! BootForm::staticInput('<strong>Nazwa surowa</strong>')->value($place->getName()) !!}
	{!! BootForm::staticInput('<strong>Nazwa wywietlana</strong>')->value($place->getTitle()) !!}
	{!! BootForm::staticInput('<strong>Opis</strong>')->value($place->getDescription()) !!}

	<?php $image = '<img class="img-responsive center-block" src="' . $place->getImage() . '"/>'; ?>

	{!! BootForm::staticInput('<strong>Obrazek</strong>')->value($image) !!}

	{!! BootForm::staticInput('<strong>Widoczna jeśli wymagania nie spełnione</strong>')
		->value($place->visible ? 'Tak' : 'Nie') !!}

	{!! BootForm::staticInput('<strong>Możliwe zwrócenie uwagi policji na wejściu</strong>')
		->value($place->dangerous ? 'Tak' : 'Nie') !!}

	{!! BootForm::staticInput('<strong>Wymagania</strong>')->value($place->getRequirements()->rawRender()) !!}


	<?php $list = '<ul class="list-group">'; ?>
	@foreach($place->components as $component)

		<?php $list .= '<li class="list-group-item">' . trans('component.' . $component) . '</li>'; ?>

	@endforeach
	<?php $list .= '</ul>'; ?>

	{!! BootForm::staticInput('<strong>Komponenty</strong>')->value($list) !!}




	@foreach(Config::get('admin.components') as $component => $properties)

		@if($place->hasComponent($component))
		
			<?php $list = '<ul class="list-group">'; ?>

			@foreach($properties as $property)


				<?php $list .= '<li class="list-group-item"><strong>' . trans('component.properties.' . $component . '.' . $property) . '</strong>: ' . 
					$place->getProperty($component . '.' . $property, '<span class="text-muted">null</span>') . '</li>'; ?>

			@endforeach


			<?php $list .= '</ul>'; ?>


			{!! BootForm::staticInput('<strong>' . trans('component.' . $component) . '</strong>')->value($list) !!}

		@endif

	@endforeach





	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.place.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.place.edit', ['place' => $place->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

		{!! BootForm::open()->delete()->action(route('admin.place.destroy', ['place' => $place->id]))->addClass('form-inline') !!}
		{!! BootForm::token() !!}

		{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

		{!! BootForm::close() !!}
	</div>

	</div>
</div>

@endsection
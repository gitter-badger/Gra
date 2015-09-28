@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">

		@if(isset($place))

			<h2>{{ $place->getTitle() }} -- Edycja</h2>
		@else

			<h2>Nowe miejsce</h2>
		@endif
	</div>

	<div class="panel-body">


	@if(isset($place))

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.place.update', ['place' => $place->id]))->enctype('multipart/form-data') !!}
	@else

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.place.store'))->enctype('multipart/form-data') !!}
	@endif


	<h3 class="text-center">Ogólne</h3>

	{!! BootForm::text('<strong>Nazwa surowa</strong>', 'name')->defaultValue(isset($place) ? $place->getName() : null)->required() !!}

	<?php $image = BootForm::image('<strong>Obrazek</strong>', 'image')->defaultValue(isset($place) ? $place->getImage() : null); ?>

	@if(!isset($place))

		<?php $image->required(); ?>
	@endif

	{!! $image !!}

	<?php 

	$checkbox = BootForm::checkbox('<strong>Widoczna jeśli wymagania nie spełnione</strong>', 'visible');

	if(empty($place) || $place->visible)
		$checkbox->check();

	echo $checkbox;
	?>

	<?php 

	$checkbox = BootForm::checkbox('<strong>Możliwe zwrócenie uwagi policji na wejściu</strong>', 'dangerous');

	if(empty($place) || $place->dangerous)
		$checkbox->check();

	echo $checkbox;
	?>

	{!! BootForm::staticInput('<strong>Wymagania - przykład</strong>')
		->value(\HempEmpire\Requirements::getConfig()) !!}

	{!! BootForm::textarea('<strong>Wymagania</strong>', 'requires')
		->value(isset($place) ? Formatter::stringify($place->requires, false, false, PHP_EOL) : null) !!}



	<h3 class="text-center">Komponenty</h3>

	@foreach(Config::get('admin.components') as $name => $properties)

		<?php $checkbox = BootForm::checkbox('<strong>' . trans('component.' . $name) . '</strong>', 'components[' . $name . ']')
			->control()->addClass('component-checkbox')->data('component', $name); ?>

		<?php if(isset($place) && $place->hasComponent($name))
			$checkbox->check(); ?>


		{!! $checkbox !!}


	@endforeach


	@foreach(Config::get('admin.components') as $component => $properties)

	<div class="component-properties" data-component="{{ $component }}">

		@if(count($properties))
			<h3 class="text-center">{{ trans('component.' . $component) }}</h3>

			@foreach($properties as $property)

			{!! BootForm::text('<strong>' . trans('component.properties.' . $component . '.' . $property) . '</strong>', 'properties[' . $component . '][' . $property . ']')
				->defaultValue(isset($place) ? $place->getProperty($component . '.' . $property) : null)->placeholder('null') !!}


			@endforeach
		@endif

	</div>

	@endforeach








	<div class="col-xs-offset-4">

		@if(isset($place))

			<a class="btn btn-danger" href="{{ route('admin.place.show', ['place' => $place->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
		@else

			<a class="btn btn-danger" href="{{ route('admin.place.index') }}">{!! entity('icon')->icon('remove') !!}</a>
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


	$('.component-checkbox').each(function() {

		var component = $(this).data('component');
		var checkbox = $(this).find('input[type=checkbox]');
		var container = $('.component-properties[data-component=' + component + ']');

		$(checkbox).change(function() {

			if($(this).is(':checked')) {

				$(container).show();
			}
			else {

				$(container).hide();
			}

		}).trigger('change');

	});
});


</script>


@endsection
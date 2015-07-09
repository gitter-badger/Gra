@extends('app')


@section('content')

<div class="panel panel-default">
	<div class="panel-heading">

		@if(isset($location))

			<h2>{{ $location->getTitle() }} -- Edycja</h2>
		@else

			<h2>Nowa lokacja</h2>
		@endif
	</div>

	<div class="panel-body">

		@if(isset($location))

			{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.location.update', ['location' => $location->id]))->enctype('multipart/form-data') !!}
		@else

			{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.location.store'))->enctype('multipart/form-data') !!}
		@endif


		<h3 class="text-center">Ogólne</h3>




		{!! BootForm::text('<strong>Nazwa surowa</strong>', 'name')->defaultValue(isset($location) ? $location->getName() : null)->required() !!}

		<?php $image = BootForm::image('<strong>Obrazek</strong>', 'image')->defaultValue(isset($location) ? $location->getImage() : null); ?>

		@if(!isset($location))

			<?php $image->required(); ?>
		@endif

		{!! $image !!}



		{!! BootForm::number('<strong>Pozycja X</strong>', 'x')->defaultValue(isset($location) ? $location->x : null)->step(0.01)->required() !!}
		{!! BootForm::number('<strong>Pozycja Y</strong>', 'y')->defaultValue(isset($location) ? $location->y : null)->step(0.01)->required() !!}
		{!! BootForm::text('<strong>Klasy</strong>', 'groups')->defaultValue(isset($location) ? implode(', ', $location->groups) : null)->placeholder('brak') !!}




		<h3 class="text-center">Miejsca</h3>

		@foreach($places as $place)

			<?php $checkbox = BootForm::checkbox($place->getTitle(), 'places[' . $place->id . ']'); ?>
			

			@if(isset($location) && $location->hasPlace($place))

				<?php $checkbox->check(); ?>
			@endif

			{!! $checkbox !!}

		@endforeach

			<div class="col-xs-offset-4">

				@if(isset($location))

					<a class="btn btn-danger" href="{{ route('admin.location.show', ['location' => $location->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
				@else

					<a class="btn btn-danger" href="{{ route('admin.location.index') }}">{!! entity('icon')->icon('remove') !!}</a>
				@endif

				<button type="submit" class="btn btn-success">

					{!! entity('icon')->icon('ok') !!}
				</button>

			</div>

		{!! BootForm::close() !!}


	</div>
</div>


@endsection
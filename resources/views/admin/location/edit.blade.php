@extends('app')


@section('content')


@if(isset($location))

	{!! BootForm::openHorizontal(['xs' => [2, 10]])->put()->action(route('admin.location.update', ['location' => $location->id]))->enctype('multipart/form-data') !!}
@else

	{!! BootForm::openHorizontal(['xs' => [2, 10]])->post()->action(route('admin.location.store'))->enctype('multipart/form-data') !!}
@endif


{!! BootForm::text('<strong>Nazwa</strong>', 'name')->defaultValue(isset($location) ? $location->getName() : null)->required() !!}



<?php $image = BootForm::image('<strong>Plan</strong>', 'plan')->defaultValue(isset($location) ? $location->getPlan() : null); ?>

@if(!isset($location))

	<?php $image->required(); ?>
@endif

{!! $image !!}



{!! BootForm::number('<strong>Pozycja X</strong>', 'x')->defaultValue(isset($location) ? $location->x : null)->step(0.01)->min(-1000)->max(1000)->required() !!}
{!! BootForm::number('<strong>Pozycja Y</strong>', 'y')->defaultValue(isset($location) ? $location->y : null)->step(0.01)->min(-1000)->max(1000)->required() !!}
{!! BootForm::text('<strong>Klasy</strong>', 'groups')->defaultValue(isset($location) ? implode(', ', $location->groups) : null)->placeholder('brak') !!}


<div class="col-xs-offset-2">

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

@endsection
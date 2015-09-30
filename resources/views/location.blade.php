@extends('app')


@section('content')

{!! $player->renderEvents() !!}
{!! Message::renderAll() !!}

<div class="location">

	<img class="location-map" src="{{ $location->getPlan() }}" />

	@foreach($location->places as $place)

		@if($place->isVisible())

			<?php $requirements = $place->getRequirements(); ?>
			<?php $checked = $requirements->check(); ?>

			@if($checked)

			{!! BootForm::open()->post() !!}
			{!! BootForm::token() !!}
			{!! BootForm::hidden('place')->value($place->id) !!}
			


			<button type="submit" class="location-pin location-pin-hoverable
					{{ $place->isDangerous() ? ' dangerous' : '' }}"
					data-name="{{ $place->getTitle() }}"
					data-desc="{{ $place->getDescription() }}"
					style="background-image: url({{ $place->getImage() }}); left: {{ $place->x * 100 }}%; top: {{ $place->y * 100 }}%;">
			</button>

			{!! BootForm::close() !!}

			@else

				<img class="location-pin location-pin-hoverable disabled
					{{ $place->isDangerous() ? ' dangerous' : '' }}" src="{{ $place->getImage() }}"
					style="left: {{ $place->x * 100 }}%; top: {{ $place->y * 100 }}%;"
					data-name="{{ $place->getTitle() }}"
					data-desc="{{ $place->getDescription() }}"
					data-requires="{!! str_replace('"', '\'', $requirements->render()) !!}"/>

			@endif
		@endif

	@endforeach
</div>






@endsection
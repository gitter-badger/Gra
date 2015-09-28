@extends('app')


@section('content')

{!! $player->renderEvents() !!}
{!! Message::renderAll() !!}

<div class="location">

	<img class="location-map" src="{{ $location->getPlan() }}" />

	@foreach($location->places as $place)

		<?php $requirements = $place->getRequirements(); ?>
		<?php $checked = $requirements->check(); ?>

		@if($checked)

		{!! BootForm::open()->post() !!}
		{!! BootForm::token() !!}
		{!! BootForm::hidden('place')->value($place->id) !!}
		


		<?php 

		$tutorialIndex = $place->isDangerous() ? 2 : 0; 
		$tutorialTitle = $place->isDangerous() ? trans('tutorial.general.dangerous.title') : trans('tutorial.general.place.title');
		$tutorialContent = $place->isDangerous() ? trans('tutorial.general.dangerous.content') : trans('tutorial.general.place.content');

		?>

		<button type="submit" class="{{ $checked ? '' : 'disabled' }}">
			<img class="location-pin location-pin-hoverable tutorial-step
				{{ $place->isDangerous() ? ' dangerous' : '' }}" src="{{ $place->getImage() }}"
				style="left: {{ $place->x * 100 }}%; top: {{ $place->y * 100 }}%;"
				data-name="{{ $place->getTitle() }}"
				data-desc="{{ $place->getDescription() }}"
				data-tutorial-index="{{ $tutorialIndex }}"
				title="{{ $tutorialTitle }}"
				data-content="{{ $tutorial-content }}"/>
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

	@endforeach
</div>






@endsection
@extends('app')


@section('content')

{!! $player->renderEvents() !!}


<div class="location">

	<img class="location-map" src="{{ $location->getPlan() }}" />

	@foreach($location->places as $place)


		{!! BootForm::open()->post() !!}
		{!! BootForm::token() !!}
		{!! BootForm::hidden('place')->value($place->id) !!}
		

		<button type="submit">
			<img class="location-pin location-pin-hoverable" src="{{ $place->getImage() }}"
				style="left: {{ $place->x * 100 }}%; top: {{ $place->y * 100 }}%;"
				data-name="{{ $place->getTitle() }}"
				data-desc="{{ $place->getDescription() }}"/>
		</button>

		{!! BootForm::close() !!}

	@endforeach
</div>






@endsection
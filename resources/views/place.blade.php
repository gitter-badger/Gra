@extends('app')


@section('content')

{!! $player->renderEvents() !!}

<div class="panel panel-default">
	
	<div class="panel-heading">

		<h3>{{ $place->getTitle() }}</h3>
	</div>

	<div class="panel-body">

		<img class="img-responsive center-block" src="{{ $place->getImage() }}" style="width: 100%">
		<br class="hidden-xs"/>
	
		{!! Message::renderAll() !!}

		<?php $first = true; ?>
		@foreach($views as $view)

			@if(!$first)

				<hr/>
			@endif

			<?php $first = false; ?>
			

			{!! $view !!}


		@endforeach


	</div>
</div>


@endsection

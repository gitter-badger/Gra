@extends('app')


@section('content')

{!! $player->renderEvents() !!}

<div class="panel panel-default">
	
	<div class="panel-heading">

		<h3>{{ $place->getTitle() }}</h3>
	</div>

	<div class="panel-body">
	
		{!! Message::renderAll() !!}



		@foreach($views as $view)

			<div class="component">
			
				{!! $view !!}
			</div>


		@endforeach


	</div>
</div>


@endsection

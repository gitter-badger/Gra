@extends('app')


@section('content')

<div class="panel panel-default">
	
	<div class="panel-heading">

		<h3>@lang('place.' . $place->name . '.name')</h3>
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
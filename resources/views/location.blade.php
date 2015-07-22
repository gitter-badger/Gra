@extends('app')


@section('content')

{!! $player->renderEvents() !!}

<div class="panel panel-default">
	<div class="panel-heading">

		<h3>{{ $location->getTitle() }}</h3>
	</div>

	<div class="panel-body">

		<img class="img-responsive center-block hidden-xs" src="{{ $location->getImage() }}" style="width: 100%"/>
		<br class="hidden-xs"/>
	
		{!! Message::renderAll() !!}
		
		<div class="row equalize">
			
			@foreach($location->places as $place)

			@if($place->isVisible())
			<div class="col-xs-12 col-sm-6 col-md-4">


				{!! BootForm::open()->post() !!}
				{!! BootForm::token() !!}
				{!! BootForm::hidden('place')->value($place->id) !!}

				<?php $requirements = $place->getRequirements(); ?>
				<?php $checked = $requirements->check(); ?>

				<button type="submit" class="btn btn-default btn-block{{ $checked  ? '' : ' disabled' }}">

					<div>
						<img class="img-responsive" src="{{ $place->getImage() }}">
		
						<div class="well">
							
							<div class=" text-wrap text-center">

								<h4>@lang('place.' . $place->name . '.name')</h4>
								<p>@lang('place.' . $place->name . '.description')</p>

								@unless($checked)
								
									{!! $requirements->render() !!}
								@endunless
							</div>
							
						</div>
					</div>
				</button>

				{!! BootForm::close() !!}

			</div>
			@endif

			@endforeach


		</div>


	</div>
</div>



@endsection
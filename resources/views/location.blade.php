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


				{!! BootForm::open()->post()->data('help', trans('help.place.' . $place->getName())) !!}
				{!! BootForm::token() !!}
				{!! BootForm::hidden('place')->value($place->id) !!}

				<?php $requirements = $place->getRequirements(); ?>
				<?php $checked = $requirements->check(); ?>


				<?php 

				$tutorialIndex = $place->isDangerous() ? 2 : 0; 
				$tutorialTitle = $place->isDangerous() ? trans('tutorial.general.dangerous.title') : trans('tutorial.general.place.title');
				$tutorialContent = $place->isDangerous() ? trans('tutorial.general.dangerous.content') : trans('tutorial.general.place.content');

				?>

				<button type="submit" class="btn btn-{{ $place->isDangerous() ? 'warning' : 'default' }} btn-block{{ $checked  ? '' : ' disabled' }} tutorial-step"
					data-tutorial-index="{{ $tutorialIndex }}" title="{{ $tutorialTitle }}" data-content="{{ $tutorialContent }}">

					<div>
						<img class="img-full" src="{{ $place->getImage() }}">
		
						<div class=" text-wrap text-center">

							<h4>@lang('place.' . $place->name . '.name')</h4>
							<p>@lang('place.' . $place->name . '.description')</p>

							@unless($checked)
							
								{!! $requirements->render() !!}
							@endunless
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
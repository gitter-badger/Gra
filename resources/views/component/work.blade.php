<div data-tutorial="true" data-tutorial-name="work">
	<h4><strong>@lang('work.title')</strong></h4>
	<div class="well text-center">
	

		<div class="row equalize">

			@forelse($works as $work)

				<div class="col-xs-12 col-sm-6 col-md-4">
					
					<div class="panel panel-default">
						<div class="panel-body">

							<h4>{{ $work->getTitle() }}</h4>
							<p>{{ $work->getDescription() }}</p>

							<?php $costs = $work->getCosts(); ?>
							<?php $rewards = $work->getRewards(); ?>
							<?php $requirements = $work->getRequirements(); ?>

							<h5><strong>@lang('work.duration')</strong></h5>
							<p>{{ Formatter::time(round($work->duration * $world->timeScale)) }}</p>

							<h5><strong>@lang('work.costs')</strong></h5>
							{!! $costs->render() !!}

							<h5><strong>@lang('work.rewards')</strong></h5>
							{!! $rewards->render() !!}




							@if($requirements->check())

								@if($costs->canTake())

									<br/>
									{!! BootForm::open()->post() !!}
									{!! BootForm::token() !!}

									{!! BootForm::hidden('action')->value('work.work') !!}
									{!! BootForm::hidden('work')->value($work->id) !!}

									<?php 
									$submit = BootForm::submit(trans('action.work'), 'btn-primary')
										->addClass('text-center')
										->addClass('tutorial-step')
										->data('tutorial-index', 0)
										->attribute('title', trans('tutorial.work.work.title'))
										->data('content', trans('tutorial.work.work.content')); 


									echo $submit;

									?>

									{!! BootForm::close() !!}

								@else

									<br/>
									<div class="btn btn-primary text-center disabled">@lang('action.work')</div>
								@endif


							@else

								<h5><strong>@lang('work.requirements')</strong></h5>
								{!! $requirements->render() !!}


							@endif


						</div>
					</div>

				</div>

			@empty

				<div class="col-xs-12">
				
					<h4>@lang('work.empty')</h4>
				</div>

			@endforelse


		</div>


		<div class="text-center">
		
			{!! $works->render() !!}
		</div>
	</div>


	@if(!is_null($lastUpdate) && !is_null($nextUpdate) && $lastUpdate != $nextUpdate)

		<div class="progress-group btn-small">


			{!! entity('timer')
				->min($lastUpdate)
				->max($nextUpdate)
				->now(time())
				->reversed(false)
			!!}


			@if($resetable)


				@if(is_null($lastReset) || $nextReset <= time())
				

				{!! BootForm::open()->post()->addClass('progress-btn') !!}
				{!! BootForm::token() !!}

				{!! BootForm::hidden('action')->value('work.reset') !!}
				{!! BootForm::submit(trans('work.reset', ['cost' => $resetCost]), 'btn-success') !!}

				{!! BootForm::close() !!}


				@else

				<div class="progress-btn">

					<div class="btn btn-success disabled time-left" data-to="{{ $nextReset }}">
					</div>

				</div>


				@endif


			@endif

		</div>
	@endif


</div>
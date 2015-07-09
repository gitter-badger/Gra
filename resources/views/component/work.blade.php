<div>

	<div class="well">

		<div class="row equalize">

			@forelse($works as $work)

				<div class="col-xs-12 col-sm-6 col-md-4">
					
					<div class="panel panel-default">
						<div class="panel-body text-center">

							<h4>{{ $work->getTitle() }}</h4>
							<p>{{ $work->getDescription() }}</p>

							<?php $costs = $work->getCosts(); ?>
							<?php $rewards = $work->getRewards(); ?>
							<?php $requirements = $work->getRequirements(); ?>

							<h5><strong>@lang('work.duration')</strong></h5>
							<p>{{ Formatter::time($work->duration) }}</p>

							<h5><strong>@lang('work.costs')</strong></h5>
							{!! $costs->render() !!}

							<h5><strong>@lang('work.rewards')</strong></h5>
							{!! $rewards->render() !!}




							@if($requirements->check())

								@if($costs->canTake())

									<br/>
									{!! BootForm::open()->post() !!}
									{!! BootForm::token() !!}

									{!! BootForm::hidden('action')->value('work') !!}
									{!! BootForm::hidden('work')->value($work->id) !!}

									{!! BootForm::submit(trans('action.work'), 'btn-primary')->addClass('text-center') !!}

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

				<div class="col-xs-12 text-center">
				
					<h4>@lang('works.empty')</h4>
				</div>

			@endforelse


		</div>

		<div class="text-center">
		
			{!! $works->render() !!}
		</div>
	</div>
</div>
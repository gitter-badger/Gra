
<div data-tutorial="true" data-tutorial-name="plantation">
	<h4><strong>@lang('plantation.title')</strong></h4>
	<div class="well">

		<div class="row">
			
			@foreach($slots as $index => $slot)

				<div class="col-xs-6 col-sm-4 col-md-2">
				@if($slot->isEmpty)
					
					<div class="tutorial-step" data-tutorial-index="0" title="@lang('tutorial.plantation.select.title')"
						data-content="@lang('tutorial.plantation.select.content')">
				@else
					@if($slot->isReady)

						<div class="tutorial-step" data-tutorial-index="3" title="@lang('tutorial.plantation.harvest.title')"
							data-content="@lang('tutorial.plantation.harvest.content')">
					@else

						<div class="tutorial-step" data-tutorial-index="2" title="@lang('tutorial.plantation.watering.title')"
							data-content="@lang('tutorial.plantation.watering.content')">
					@endif
				@endif


					@if($slot->isEmpty)

						<button type="button" class="btn btn-default btn-block no-padding"
							data-toggle="modal" data-target="#seedsModal" data-slot="{{ $index }}">

							<div class="plantation-pot"></div>
						</button>
					@else

						<?php $content = null; $after = null; ?>

						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}
						{!! BootForm::hidden('slot')->value($index) !!}

						<?php $frame = clamp((time() - $slot->start) / ($slot->end - $slot->start), 0, 1) * 17; ?>
						<?php $content = '<img class="plantation-pot plantation-plant img-responsive" data-start="' . $slot->start . 
							'" data-end="' . $slot->end . '" data-watering="' . $slot->nextWatering . '" src="' . asset('images/plants/plant-' . $frame . '.png') . '"/>'; ?>

						<?php $submit = BootForm::submit($content)
							->addClass('btn-block no-padding')
							->data('square', 'height'); ?>


						@if($slot->isReady)


							{!! BootForm::hidden('action')->value('harvest') !!}

						@else

							{!! BootForm::hidden('action')->value('watering') !!}

							<?php $after = entity('timer')
								->min($slot->start)
								->max($slot->end)
								->stop($slot->nextWatering)
								->ca('#337AB7')
								->cb('#5CB85C'); ?>

						@endif




						{!! $submit !!}
						{!! BootForm::close() !!}
						{!! $after !!}
					@endif


				</div>
			</div>

			@endforeach



		</div>
	</div>

	@if(isset($seeds))

	<div class="modal fade" id="seedsModal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">@lang('plantation.seeds')</h4>
				</div>
				<div class="modal-body">
					

					@if(count($seeds) > 0)

						<?php $first = true; ?>
						@foreach($seeds as $seed)

							{!! BootForm::open()->post() !!}
							{!! BootForm::token() !!}
							{!! BootForm::hidden('action')->value('plant') !!}
							{!! BootForm::hidden('seed')->value($seed->getId()) !!}
							{!! BootForm::hidden('slot')->value(-1) !!}

							<button type="submit" class="btn btn-default btn-block{{ $first ? ' tutorial-step' : '' }}"{!! $first ? ' data-tutorial-index="1" title="' 
								. trans('tutorial.plantation.plant.title') . '" data-content="' . trans('tutorial.plantation.plant.content') . '"' : '' !!}>

								<div class="media">
									<div class="media-left media-middle">
										<img class="media-object" src="{{ $seed->getImage() }}" style="max-width: 64px">
									</div>
									<div class="media-body">
										<h3 class="media-heading">{{ $seed->getTitle() }} ({{ $seed->getCount() }})</h3>

										<div class="container-fluid">

											<div class="row text-center">
									
												<div class="col-xs-6 col-sm-4 col-md-3">
													<p><strong>@lang('item.seed.growth'): </strong><br/> {{ Formatter::time(round($seed->getGrowth() * $world->timeScale)) }}</p>
												</div>
												<div class="col-xs-6 col-sm-4 col-md-3">
													<p><strong>@lang('item.seed.watering'): </strong><br/> {{ Formatter::time(round($seed->getWatering() * $world->timeScale)) }}</p>
												</div>
												<div class="col-xs-6 col-sm-4 col-md-3">
													<p><strong>@lang('item.seed.harvest'): </strong><br/> {{ $seed->getMinHarvest() }} - {{ $seed->getMaxHarvest() }}</p>
												</div>
												<div class="col-xs-6 col-sm-4 col-md-3">
													<p><strong>@lang('item.seed.quality'): </strong><br/>

													@for($i = 0; $i < 5; ++$i)

														@if($i < $seed->getQuality())

															{!! entity('icon')->icon('star') !!}
														@else

															{!! entity('icon')->icon('star-empty') !!}
														@endif


													@endfor


													</p>
												</div>


											</div>
										</div>
									</div>

								</div>

							</button>

							{!! BootForm::close() !!}

							<?php $first = false; ?>
						@endforeach

					@else
					
						<h4 class="text-center">@lang('plantation.empty')</h4>
					@endif
				</div>
			</div>
		</div>
	</div>

	@endif
</div>
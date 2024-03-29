<div data-tutorial="true" data-tutorial-name="shop">
	<h4><strong>@lang('shop.title')</strong></h4>
	<?php $url = Request::url(); ?>

	<ul class="nav nav-tabs">
		
		<li{!! $view === 'items' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}">
				@lang('item.types.all')
				<span class="badge">{{ $all }}</span>
			</a>
		</li>

		@if($weapons > 0)

		<li{!! $view === 'weapons' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}?view=weapons">
				@lang('item.types.weapons')
				<span class="badge">{{ $weapons }}</span>
			</a>
		</li>
		@endif

		@if($armors > 0)

		<li{!! $view === 'armors' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}?view=armors">
				@lang('item.types.armors')
				<span class="badge">{{ $armors }}</span>
			</a>
		</li>
		@endif

		@if($foods > 0)

		<li{!! $view === 'foods' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}?view=foods">
				@lang('item.types.foods')
				<span class="badge">{{ $foods }}</span>
			</a>
		</li>
		@endif

		@if($vehicles > 0)

		<li{!! $view === 'vehicles' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}?view=vehicles">
				@lang('item.types.vehicles')
				<span class="badge">{{ $vehicles }}</span>
			</a>
		</li>
		@endif

		@if($seeds > 0)

		<li{!! $view === 'seeds' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}?view=seeds">
				@lang('item.types.seeds')
				<span class="badge">{{ $seeds }}</span>
			</a>
		</li>
		@endif

		@if($stuffs > 0)

		<li{!! $view === 'stuffs' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}?view=stuffs">
				@lang('item.types.stuffs')
				<span class="badge">{{ $stuffs }}</span>
			</a>
		</li>
		@endif

	</ul>

	<div class="tab-content">

		<div class="well">
			<div class="row equalize">

			@forelse($items as $item)

				<?php $requirements = $item->getRequirements(); ?>

				<div class="col-xs-12 col-md-6{{ $requirements->check() ? '' : ' disabled' }}">
					
					<div class="panel panel-default">
						
						<div class="panel-body text-center">

							@include('details.item')

							<div class="row">
								<div class="col-xs-10 col-xs-offset-1">

								{!! BootForm::open()->post()->action(route('game', ['view' => $view])) !!}
								{!! BootForm::token() !!}

								{!! BootForm::hidden('action')->value('shop.buy') !!}
								{!! BootForm::hidden('item')->value($item->getId()) !!}
								{!! BootForm::hidden('type')->value($item->getType()) !!}
								
								<?php

								$submit = BootForm::submit(trans('action.buy'), 'btn-primary')->addClass('center-block')
									->addClass('tutorial-step')
									->data('tutorial-index', 0)
									->attribute('title', trans('tutorial.shop.buy.title'))
									->data('content', trans('tutorial.shop.buy.content'));

								?>



								@if($requirements->check())

									@if($item->getCount() > 1)
									
										<div class="row">

											<div class="col-xs-12 col-sm-10">
											
												{!! BootForm::number(null, 'count')->min(1)->max($item->getCount())->defaultValue(1) !!}
											</div>

											<div class="col-xs-12 col-sm-2">

												{!! $submit !!}
											</div>

										</div>

				
									@else

										{!! $submit !!}

									@endif
								@else

									{!! $requirements->render() !!}

								@endif

								{!! BootForm::close() !!}

								</div>
							</div>

						</div>

					</div>


				</div>

				<?php $first = false; ?>
			@empty


				<div class="col-xs-12 text-center">
			
					<h4>@lang('shop.empty')</h4>

				</div>

			@endforelse
			</div>
		</div>

		<div class="text-center">

			{!! $items->render() !!}
		</div>


	</div>

	@if(!is_null($lastUpdate) && !is_null($nextUpdate))

		<div class="progress-group">


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

				{!! BootForm::hidden('action')->value('shop.reset') !!}
				{!! BootForm::submit(trans('shop.reset', ['cost' => $resetCost]), 'btn-success') !!}

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
<div>
	<h4><strong>@lang('store.title')</strong></h4>
	<?php $url = Request::url(); ?>
	
	<ul class="nav nav-tabs">

		@if($canTake)
		<li{!! $view == 'take' ? ' class="active"' : '' !!}>
			<a href="{{ $url }}?view=take">
				@lang('store.take')
			</a>
		</li>
		@endif

		@if($canPut)
		<li{!! $view == 'put' ? ' class="active"' : '' !!}>
			<a href="{{ $url }}?view=put">
				@lang('store.put')
			</a>
		</li>
		@endif
		

	</ul>

	<div class="tab-content">

		<div class="well">
			<div class="row equalize">

			@if($view == 'gangRequired')

				<div class="col-xs-12">

					<h5 class="text-center"><strong>@lang('gang.required')</strong></h5>
				</div>

			@else

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

									{!! BootForm::hidden('action')->value($view) !!}
									{!! BootForm::hidden('item')->value($item->getId()) !!}
									{!! BootForm::hidden('type')->value($item->getType()) !!}

									@if($canTake && $view == 'take' || $canPut && $view == 'put')

										@if($requirements->check())

											@if($item->getCount() > 1)
											
												<div class="input-group">

													{!! BootForm::number(null, 'count')->min(1)->max($item->getCount())->defaultValue(1) !!}

													<div class="input-group-btn">

														{!! BootForm::submit(trans('action.' . $view), 'btn-primary')->addClass('center-block') !!}
													</div>

												</div>

						
											@else

												{!! BootForm::submit(trans('action.' . $view), 'btn-primary')->addClass('center-block') !!}

											@endif
										@else

											{!! $requirements->render() !!}

										@endif

										{!! BootForm::close() !!}

										</div>
									@else

										<h5 class="text-center"><strong>@lang('gang-store.cant' . ucfirst($view))</strong></h5>
									@endif
								</div>

							</div>

						</div>


					</div>

				@empty

					<div class="col-xs-12 text-center">
				
						<h4>@lang('store.empty')</h4>

					</div>


				@endforelse
				</div>

				<div class="text-center">

					{!! $items->render() !!}
				</div>

			@endif
		</div>

		{!! entity('progress')
			->min(0)
			->now($weight)
			->max($capacity) !!}


		@if($canUpgrade)
		<br/>

		<div class="well text-center">
			<div class="row">

				<div class="col-xs-12 col-sm-4">

					<div class="panel panel-default">
						<div class="panel-heading"><h4>@lang('gang-store.expand.normal')</h4></div>
						<div class="panel-body">

							{!! BootForm::open()->post() !!}
							{!! BootForm::token() !!}

							{!! BootForm::hidden('action')->value('expand') !!}
							{!! BootForm::hidden('type')->value('normal') !!}

							{!! BootForm::staticInput(trans('gang-store.expand.price'))->value('$' . $moneyPrice) !!}
							{!! BootForm::submit(trans('action.expand'), 'btn-primary') !!}

							{!! BootForm::close() !!}
						</div>
					</div>
				</div>

				@if($canWithdraw)
				<div class="col-xs-12 col-sm-4">

					<div class="panel panel-default">
						<div class="panel-heading"><h4>@lang('gang-store.expand.gang')</h4></div>
						<div class="panel-body">

							{!! BootForm::open()->post() !!}
							{!! BootForm::token() !!}

							{!! BootForm::hidden('action')->value('expand') !!}
							{!! BootForm::hidden('type')->value('gang') !!}

							{!! BootForm::staticInput(trans('gang-store.expand.price'))->value('$' . $moneyPrice) !!}
							{!! BootForm::submit(trans('action.expand'), 'btn-primary') !!}

							{!! BootForm::close() !!}
						</div>
					</div>
				</div>
				@endif

				<div class="col-xs-12 col-sm-4">

					<div class="panel panel-default">
						<div class="panel-heading"><h4>@lang('gang-store.expand.premium')</h4></div>
						<div class="panel-body">

							{!! BootForm::open()->post() !!}
							{!! BootForm::token() !!}

							{!! BootForm::hidden('action')->value('expand') !!}
							{!! BootForm::hidden('type')->value('premium') !!}

							{!! BootForm::staticInput(trans('gang-store.expand.price'))->value($premiumPrice . 'pp') !!}
							{!! BootForm::submit(trans('action.expand'), 'btn-primary') !!}

							{!! BootForm::close() !!}
						</div>
					</div>
				</div>


			</div>
		</div>
		@endif

	</div>

</div>
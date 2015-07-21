<div>
	<h4><strong>@lang('market.title')</strong></h4>
	<div>
		<?php $url = Request::url(); ?>
		
		<ul class="nav nav-tabs">

			<li{!! $view == 'buy' ? ' class="active"' : '' !!}>
				<a href="{{ $url }}?view=buy">
					@lang('market.buy')
				</a>
			</li>

			<li{!! $view == 'sell' ? ' class="active"' : '' !!}>
				<a href="{{ $url }}?view=sell">
					@lang('market.sell')
				</a>
			</li>
			

		</ul>

		<div class="tab-content">
			<div class="well">
				<div class="row equalize">

					@forelse($items as $item)


						<?php $requirements = $item->getRequirements(); ?>

						
						<div class="col-xs-12 col-md-6{{ $requirements->check() ? '' : ' disabled' }}">
							
							<div class="panel panel-default">
								
								<div class="panel-body">

									@include('details.item', ['typeDetails' => $view == 'sell'])

									<div class="row">
										<div class="col-xs-10 col-xs-offset-1 text-center">

										{!! BootForm::open()->post()->action(route('game', ['view' => $view])) !!}
										{!! BootForm::token() !!}

										{!! BootForm::hidden('action')->value($view) !!}
										{!! BootForm::hidden('item')->value($item->getId()) !!}
										{!! BootForm::hidden('type')->value($item->getType()) !!}


										@if($requirements->check())


											@if($view == 'sell')
												{!! BootForm::number('<strong>' . trans('market.price') . '</strong>', 'price')
													->min(round($item->getPrice() * $minPrice))->max(round($item->getPrice() * $maxPrice)) !!}


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

												@if($item->isPremium())

													<p><strong>@lang('market.price'): </strong> {{ $item->getPrice() * $item->getCount() }}pp</p>
												@else

													<p><strong>@lang('market.price'): </strong> ${{ $item->getPrice() * $item->getCount() }}</p>
												@endif

												{!! BootForm::submit(trans('action.' . $view), 'btn-primary')->addClass('center-block') !!}
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

					@empty

						<div class="col-xs-12 text-center">
					
							<h4>@lang('market.empty')</h4>

						</div>


					@endforelse
					

				</div>

				<div class="text-center">

					{!! $items->render() !!}
				</div>
			</div>
		</div>
	</div>
</div>
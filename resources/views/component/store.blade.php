<div>
	<?php $url = Request::url(); ?>
	
	<ul class="nav nav-tabs">

		<li{!! $view == 'take' ? ' class="active"' : '' !!}>
			<a href="{{ $url }}?view=take">
				@lang('store.take')
			</a>
		</li>

		<li{!! $view == 'put' ? ' class="active"' : '' !!}>
			<a href="{{ $url }}?view=put">
				@lang('store.put')
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
						
						<div class="panel-content">

							@include('details.item')

							<div class="row">
								<div class="col-xs-10 col-xs-offset-1">

								{!! BootForm::open()->post()->action(route('game', ['view' => $view])) !!}
								{!! BootForm::token() !!}

								{!! BootForm::hidden('action')->value('buy') !!}
								{!! BootForm::hidden('item')->value($item->getId()) !!}
								{!! BootForm::hidden('type')->value($item->getType()) !!}


								@if($requirements->check())

									@if($item->getCount() > 1)
									
										<div class="input-group">

											{!! BootForm::number(null, 'count')->min(1)->max($item->getCount())->defaultValue(1) !!}

											<div class="input-group-btn">

												{!! BootForm::submit(trans('action.buy'), 'btn-primary')->addClass('center-block') !!}
											</div>

										</div>

				
									@else

										{!! BootForm::submit(trans('action.buy'), 'btn-primary')->addClass('center-block') !!}

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
			
					<h4>@lang('store.empty')</h4>

				</div>


			@endforelse
			</div>

			<div class="text-center">

				{!! $items->render() !!}
			</div>
		</div>

	</div>

</div>
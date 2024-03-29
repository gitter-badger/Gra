<div data-tutorial="true" data-tutorial-name="store">
	<h4><strong>@lang('store.title')</strong></h4>
	<?php $url = Request::url(); ?>
	
	<ul class="nav nav-tabs">

		<li class="tutorial-step{!! $view == 'take' ? ' active' : '' !!}" data-tutorial-index="0"
			title="@lang('tutorial.store.switchTake')">
			<a href="{{ $url }}?view=take">
				@lang('store.take')
			</a>
		</li>

		<li class="tutorial-step{!! $view == 'put' ? ' active' : '' !!}" data-tutorial-index="0"
			title="@lang('tutorial.store.switchPut')">
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
						
						<div class="panel-body text-center">

							@include('details.item')

							<div class="row">
								<div class="col-xs-10 col-xs-offset-1">

								{!! BootForm::open()->post()->action(route('game', ['view' => $view])) !!}
								{!! BootForm::token() !!}

								{!! BootForm::hidden('action')->value('store.' . $view) !!}
								{!! BootForm::hidden('item')->value($item->getId()) !!}
								{!! BootForm::hidden('type')->value($item->getType()) !!}

								<?php 
								$submit = BootForm::submit(trans('action.' . $view), 'btn-primary')
									->addClass('center-block')
									->addClass('tutorial-step')
									->data('tutorial-index', $view == 'take' ? 2 : 1)
									->attribute('title', trans('tutorial.store.' . $view . '.title'))
									->data('content', trans('tutorial.store.' . $view . '.content'));

								?>

								@if($requirements->check())

									@if($item->getCount() > 1)
									
										<div class="input-group">

											{!! BootForm::number(null, 'count')->min(1)->max($item->getCount())->defaultValue(1) !!}

											<div class="input-group-btn">

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

		{!! entity('progress')
			->min(0)
			->now($weight)
			->max($capacity) !!}

	</div>
	<br/>

	<div class="well">

		<div class="row">

			<div class="col-xs-6">

				<div class="panel panel-default">
					<div class="panel-body text-center">


						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}
						{!! BootForm::hidden('action')->value('store.expand') !!}
						{!! BootFOrm::hidden('type')->value('normal') !!}

						{!! BootForm::staticInput('<strong>' . trans('store.upgradePrice') . '</strong>')
							->value('$' . $normalPrice) !!}

						{!! BootForm::submit(trans('action.expand'), 'btn-primary') !!}
						{!! BootForm::close() !!}
					</div>
				</div>
			</div>

			<div class="col-xs-6">

				<div class="panel panel-default">
					<div class="panel-body text-center">


						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}
						{!! BootForm::hidden('action')->value('store.expand') !!}
						{!! BootFOrm::hidden('type')->value('premium') !!}

						{!! BootForm::staticInput('<strong>' . trans('store.premiumUpgradePrice') . '</strong>')
							->value($premiumPrice . 'pp') !!}

						{!! BootForm::submit(trans('action.expand'), 'btn-primary') !!}
						{!! BootForm::close() !!}
					</div>
				</div>
			</div>

		</div>
	</div>

</div>
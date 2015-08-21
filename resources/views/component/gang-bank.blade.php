<div>
	<h4><strong>@lang('gang-bank.title')</strong></h4>
	<?php $url = Request::url(); ?>

	<ul class="nav nav-tabs">

		@if($canDeposit)
		<li{!! $view == 'deposit' ? ' class="active"' : '' !!}>
			<a href="{{ $url }}?view=deposit">
				@lang('gang-bank.deposit')
			</a>
		</li>
		@endif

		@if($canWithdraw)
		<li{!! $view == 'withdraw' ? ' class="active"' : '' !!}>
			<a href="{{ $url }}?view=withdraw">
				@lang('gang-bank.withdraw')
			</a>
		</li>
		@endif
		

	</ul>

	<div class="tab-content">
		<div class="well text-center">

			
			<div class="row">
				<div class="col-xs-6 col-xs-offset-3">

					<div class="panel panel-default">
						<div class="panel-body">

							@if(is_null($gang))

								<h5 class="text-center"><strong>@lang('gang.required')</strong></h5>

							@else

								{!! BootForm::open()->post() !!}
								{!! BootForm::token() !!}
								{!! BootForm::hidden('action')->value($view) !!}

								{!! BootForm::staticInput('<strong>' . trans('gang.money') . '</strong>')
									->value('$' . $gang->money) !!}


								@if($view == 'deposit')

									@if($canDeposit)

										{!! BootForm::number('<strong>' . trans('gang-bank.moneyDeposit') . '</strong>', 'money')
											->min(1)->max($player->money) !!}

										{!! BootForm::submit(trans('gang-bank.' . $view), 'btn-primary')
											->addClass('center-block') !!}
									@else

										<h5 class="text-center"><strong>@lang('gang-bank.cantDeposit')</strong></h5>
									@endif

								@else

									@if($canWithdraw)


										{!! BootForm::number('<strong>' . trans('gang-bank.moneyWithdraw') . '</strong>', 'money')
											->min(1)->max($gang->money) !!}

										{!! BootForm::submit(trans('gang-bank.' . $view), 'btn-primary')
											->addClass('center-block') !!}
									@else

										<h5 class="text-center"><strong>@lang('gang-bank.cantWithdraw')</strong></h5>

									@endif

								@endif



								{!! BootForm::close() !!}

							@endif

						</div>
					</div>

				</div>
			</div>

		</div>
	</div>
</div>
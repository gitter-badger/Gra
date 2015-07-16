<div>
	<?php $url = Request::url(); ?>

	<ul class="nav nav-tabs">

		<li{!! $view == 'deposit' ? ' class="active"' : '' !!}>
			<a href="{{ $url }}?view=deposit">
				@lang('bank.deposit')
			</a>
		</li>

		<li{!! $view == 'withdraw' ? ' class="active"' : '' !!}>
			<a href="{{ $url }}?view=withdraw">
				@lang('bank.withdraw')
			</a>
		</li>
		

	</ul>

	<div class="tab-content">
		<div class="well">

			<div class="row">
				<div class="col-xs-6 col-xs-offset-3">

					<div class="panel panel-default">
						<div class="panel-body text-center">

							{!! BootForm::open()->post() !!}
							{!! BootForm::token() !!}
							{!! BootForm::hidden('action')->value($view) !!}

							{!! BootForm::staticInput('<strong>' . trans('bank.money') . '</strong>')
								->value('$' . $bank->money) !!}


							@if($view == 'deposit')


							{!! BootForm::number('<strong>' . trans('bank.moneyDeposit') . '</strong>', 'money')
								->min(1)->max($player->money) !!}

							@else


							{!! BootForm::number('<strong>' . trans('bank.moneyWithdraw') . '</strong>', 'money')
								->min(1)->max($bank->money) !!}

							@endif

							{!! BootForm::submit(trans('bank.' . $view), 'btn-primary')
								->addClass('center-block') !!}


							{!! BootForm::close() !!}

						

						</div>
					</div>

				</div>
			</div>

		</div>
	</div>
</div>
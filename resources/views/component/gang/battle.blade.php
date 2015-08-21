

<div class="panel panel-default">
	<div class="panel-body text-center">

		{!! entity('timer')
			->min($gang->startAttack)
			->max($gang->endAttack)
			->now(time())
			->reversed(time()) !!}


		@if($player->member->joins)

			<p>@lang('gang.joined')</p>
		@else

			{!! BootForm::open()->post() !!}
			{!! BootForm::token() !!}
			{!! BootForm::hidden('action')->value('join') !!}

			{!! BootForm::submit(trans('action.join'), 'btn-primary') !!}

			{!! BootForm::close() !!}

		@endif
	</div>
</div>
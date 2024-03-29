<div class="row">
	<div class="col-xs-12">

		<div class="panel panel-default">
			<div class="panel-heading"><h5><strong>@lang('gang.' . $gang->action)</strong></h5></div>
			<div class="panel-body">



				
				{!! entity('timer')
					->min($gang->startAttack)
					->max($gang->endAttack)
					->reversed(true)
					->reload(true) !!}


				@if(!$player->member->joins)

					{!! BootForm::open()->post() !!}
					{!! BootForm::token() !!}

					{!! BootForm::hidden('action')->value('join') !!}
					{!! BootForm::submit(trans('action.join'), 'btn-primary')->addClass('center-block') !!}

					{!! BootForm::close() !!}

				@else

					<h5 class="text-center">@lang('gang.joined')</h5>

				@endif


			</div>
		</div>
	</div>
</div>
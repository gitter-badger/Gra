<div class="well">
	
	<div class="row">
		<div class="col-xs-6 col-xs-offset-3">
			
			<div class="panel panel-default">
				<div class="panel-body text-center">

					<h4>@lang('church.description')</h4>

					@if($timer->active)


						<p>@lang('church.wait')</p>

						{!! entity('timer')
							->min($timer->start)
							->max($timer->end)
							->now(time())
							->reversed(true)
							->reload(true) !!}

					@else


						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}
						{!! BootForm::hidden('action')->value('bless') !!}


						<p><strong>@lang('church.price'):</strong> ${{ $price }}</p>
						<p><strong>@lang('church.bonus'):</strong> {{ $bonus }}%</p>

						{!! BootForm::submit(trans('action.pay'), 'btn-primary')
							->addClass('center-block') !!}
						

						{!! BootForm::close() !!}


					@endif


				</div>
			</div>


		</div>
	</div>
</div>
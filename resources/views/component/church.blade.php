<div data-tutorial="true" data-tutorial-name="church">
	<h4><strong>@lang('church.title')</strong></h4>
	<div class="well text-center">

		<div class="row">
			<div class="col-xs-6 col-xs-offset-3">
				
				<div class="panel panel-default">
					<div class="panel-body">

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
								->addClass('center-block')
								->addClass('tutorial-step')
								->data('tutorial-index', 0)
								->attribute('title', trans('tutorial.chruch.bless.title'))
								->data('content', trans('tutorial.church.bless.content')) !!}
							

							{!! BootForm::close() !!}


						@endif


					</div>
				</div>


			</div>
		</div>
	</div>
</div>
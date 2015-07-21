<div>

	<h4><strong>@lang('dealing.title')</strong></h4>
	<div class="well text-center" data-ng-app="" data-ng-init="duration={{ $minDuration }}">
		
		<div class="row">

			<div class="col-xs-12 col-md-6 col-md-offset-3">

				<div class="panel panel-default">
					<div class="panel-body">
					
						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}
						{!! BootForm::hidden('action')->value('deal') !!}

						<div class="text-center">

							<p><strong>@lang('dealing.energy')</strong>: <span data-ng-bind="duration * {{ $energy }}"></span></p>

							{!! BootForm::range('<strong>' . trans('dealing.price') . '</strong>:', 'price')
								->min($minPrice)->max($maxPrice)->value(round(($minPrice + $maxPrice) / 2))->before('$') !!}

							{!! BootForm::range('<strong>' . trans('dealing.duration') . '</strong>:', 'duration')
								->min($minDuration)->max($maxDuration)->value($minDuration)->after('0m')->data('ng-model', 'duration') !!}


							{!! BootForm::submit(trans('action.dealing'), 'btn-primary') !!}
						</div>

						{!! BootForm::close() !!}
					</div>
				</div>



			</div>

		</div>
	</div>



</div>
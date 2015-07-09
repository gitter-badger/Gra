<div>

<div class="well" data-ng-app="" data-ng-init="duration={{ $minDuration }}">
	
	<div class="row">

		<div class="col-xs-12 col-md-6 col-md-offset-3">

			{!! BootForm::open()->post() !!}
			{!! BootForm::token() !!}
			{!! BootForm::hidden('action')->value('deal') !!}

			<div class="text-center">

				<h4><strong>@lang('dealing.title')</strong></h4>
				<p><strong>@lang('dealing.energy')</strong>: <span data-ng-bind="duration * {{ $energy }}"></span></p>

				{!! BootForm::range('<strong>' . trans('dealing.duration') . '</strong>:', 'duration')
					->min($minDuration)->max($maxDuration)->value($minDuration)->after('h')->data('ng-model', 'duration') !!}


				{!! BootForm::submit(trans('dealing.start'), 'btn-primary') !!}
			</div>

			{!! BootForm::close() !!}


		</div>

	</div>
</div>



</div>
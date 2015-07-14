<div class="well">

	<div class="row">
		<div class="col-xs-6 col-xs-offset-3">
					
			<div class="row">
				<div class="col-xs-12 col-sm-4">
					
					<p><strong>@lang('investment.money')</strong></p>
				</div>
				<div class="col-xs-12 col-sm-8">
					

					<div class="progress-group">
						{!! entity('progress')
							->min(0)
							->now($investment->money)
							->max($investment->capacity)
							->style('success')
						!!}

						{!! entity('timer') 
							->addClass('progress-xs')
							->min($investment->lastUpdate)
							->max($investment->nextUpdate)
							->reversed(false)
							->reload(true)
							->labelVisible(false)
						!!}
					</div>
				</div>
			</div>


		</div>
	</div>



	<div class="row">
		<div class="col-xs-6 col-xs-offset-3">


			<div class="row">
				<div class="col-xs-12 col-sm-4">
					
					<p><strong>@lang('investment.income')</strong></p>
				</div>
				<div class="col-xs-12 col-sm-8 text-center">
					
					<p>+${{ $investment->income }}</p>
				</div>
			</div>

		</div>
	</div>

	<div class="row">
		<div class="col-xs-6 col-xs-offset-3">

			{!! BootForm::open()->post() !!}
			{!! BootForm::token() !!}
			{!! BootForm::hidden('action')->value('collect') !!}


			{!! BootForm::submit(trans('action.collect'), 'btn-primary')->addClass('center-block') !!}

			{!! BootForm::close() !!}

		</div>
	</div>



	<div class="row text-center">

		<div class="col-xs-6 col-xs-offset-3">

			<div class="row equalize">

				@if($investment->incomeLevel < $investment->incomeMaxLevel)

				<div class="col-xs-6">

					<div class="panel panel-default">
						<div class="panel-body">

							<p><strong>@lang('investment.incomeBonus'):</strong> ${{ $investment->investment->incomePerLevel }}</p>
							<p><strong>@lang('investment.upgradeCost'):</strong> ${{ $investment->upgradeCost }}</p>

							{!! BootForm::open()->post() !!}
							{!! BootForm::token() !!}
							{!! BootForm::hidden('action')->value('upgrade') !!}
							{!! BootForm::hidden('upgrade')->value('income') !!}

							{!! BootForm::submit(trans('action.upgrade'), 'btn-primary')->addClass('center-block') !!}

							{!! BootForm::close() !!}
						</div>
					</div>
				</div>

				@endif


				@if($investment->capacityLevel < $investment->capacityMaxLevel)

				<div class="col-xs-6">
					
					<div class="panel panel-default">
						<div class="panel-body">

							<p><strong>@lang('investment.capacityBonus'):</strong> {{ $investment->investment->capacityPerLevel }}</p>
							<p><strong>@lang('investment.upgradeCost'):</strong> ${{ $investment->upgradeCost }}</p>

							{!! BootForm::open()->post() !!}
							{!! BootForm::token() !!}
							{!! BootForm::hidden('action')->value('upgrade') !!}
							{!! BootForm::hidden('upgrade')->value('capacity') !!}

							{!! BootForm::submit(trans('action.upgrade'), 'btn-primary')->addClass('center-block') !!}

							{!! BootForm::close() !!}
						</div>
					</div>
				</div>

				@endif

			</div>


		</div>
	</div>

</div>
<div data-tutorial="true" data-tutorial-name="investment">
	<h4><strong>@lang('investment.title', ['name' => trans('investment.' . $investment->investment->name)])</strong></h4>

	<div class="well text-center">

		@if($investment->bought)

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


				{!! BootForm::submit(trans('action.collect'), 'btn-primary')->addClass('center-block')
					->addClass('tutorial-step')
					->data('tutorial-index', 1)
					->attribute('title', trans('tutorial.investment.collect.title'))
					->data('content', trans('tutorial.investment.collect.content')) !!}

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
								{!! BootForm::hidden('action')->value('investment.upgrade') !!}
								{!! BootForm::hidden('upgrade')->value('income') !!}

								{!! BootForm::submit(trans('action.upgrade'), 'btn-primary')->addClass('center-block')
									->addClass('tutorial-step')
									->data('tutorial-index', 2)
									->attribute('title', trans('tutorial.investment.upgrade.title'))
									->data('content', trans('tutorial.investment.upgrade.content')) !!}

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
								{!! BootForm::hidden('action')->value('investment.upgrade') !!}
								{!! BootForm::hidden('upgrade')->value('capacity') !!}

								{!! BootForm::submit(trans('action.upgrade'), 'btn-primary')->addClass('center-block')
									->addClass('tutorial-step')
									->data('tutorial-index', 2)
									->attribute('title', trans('tutorial.investment.upgrade.title'))
									->data('content', trans('tutorial.investment.upgrade.content'))  !!}

								{!! BootForm::close() !!}
							</div>
						</div>
					</div>

					@endif

				</div>


			</div>


		@if($investment->hasManager())

			<?php $manager = $investment->getManager(); ?>

			<div class="col-xs-12">
				<div class="row">

					<div class="col-xs-6 col-xs-offset-3">
						
						<div class="panel panel-default">
							<div class="panel-body text-center">

								<p><strong>@lang('investment.manager.cost'):</strong> {{ Formatter::percent($manager['cost']) }}</p>
								<p>
									<strong>@lang('investment.manager.duration'):</strong> 
									{!! entity('timer')
										->min($investment->getManagerStart())
										->max($investment->getManagerEnd())
										->now(time());
									!!}
								</p>

								<p><strong>@lang('investment.manager.money'): </strong> ${{ $investment->managerMoney }}</p>


								<div class="center-block">
								
									{!! BootForm::open()->post()->addClass('form-inline') !!}
									{!! BootForm::token() !!}

									{!! BootForm::hidden('action')->value('receive') !!}
									{!! BootForm::submit(trans('action.receive'), 'btn-success') !!}

									{!! BootForm::close() !!}

									{!! BootForm::open()->post()->addClass('form-inline') !!}
									{!! BootForm::token() !!}

									{!! BootForm::hidden('action')->value('release') !!}
									{!! BootForm::submit(trans('action.release'), 'btn-danger') !!}

									{!! BootForm::close() !!}


								</div>

							</div>
						</div>
					</div>

				</div>
			</div>
		@else
			<div class="col-xs-12">
				<div class="row">

					@foreach($managers as $id => $manager)

					<div class="col-xs-6 col-sm-4 col-md-3">
						
						<div class="panel panel-default">
							<div class="panel-body text-center">

								<p><strong>@lang('investment.manager.price'):</strong> ${{ $manager['price'] }}</p>
								<p><strong>@lang('investment.manager.cost'):</strong> {{ Formatter::percent($manager['cost']) }}</p>
								<p><strong>@lang('investment.manager.duration'):</strong> {{ Formatter::time($manager['duration']) }}</p>

								{!! BootForm::open()->post() !!}
								{!! BootForm::token() !!}

								{!! BootForm::hidden('action')->value('hire') !!}
								{!! BootForm::hidden('manager')->value($id) !!}

								{!! BootForm::submit(trans('action.hire'), 'btn-primary')->addClass('center-block') !!}

								{!! BootForm::close() !!}

							</div>
						</div>
					</div>


					@endforeach
				</div>
			</div>

		@endif
		</div>

		@else

		<div class="row">

			<div class="col-xs-6 col-xs-offset-3">

				<div class="row">


					<div class="col-xs-6 col-xs-offset-3">

						<div class="panel panel-default">
							<div class="panel-body text-center">


								@if($investment->worksCount < $investment->worksNeeded)

									<p><strong>@lang('investment.works'):</strong></p>

									{!! entity('progress')
										->min(0)
										->now($investment->worksCount)
										->max($investment->worksNeeded)
										->style('info')
									!!}

								@else


									<p><strong>@lang('investment.price'):</strong> ${{ $price }}</p>

									{!! BootForm::open()->post() !!}
									{!! BootForm::token() !!}
									{!! BootForm::hidden('action')->value('invest') !!}

									{!! BootForm::submit(trans('action.buy'), 'btn-primary')->addClass('center-block')
										->addClass('tutorial-step')
										->data('tutorial-index', 0)
										->attribute('title', trans('tutorial.investment.buy.title'))
										->data('content', trans('tutorial.investment.buy.content')) !!}

									{!! BootForm::close() !!}

								@endif
							</div>
						</div>
					</div>


				</div>


			</div>
		</div>

		@endif


	</div>
</div>
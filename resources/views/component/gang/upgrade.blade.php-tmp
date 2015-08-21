<div class="row">
	<div class="col-xs-12 col-sm-4">

		<div class="panel panel-default">
			<div class="panel-heading"><h5><strong>@lang('gang.upgradeAttack')</strong></h5></div>
			<div class="panel-body text-center">



				@if($gang->attackLevel >= $gang->attackMaxLevel)


					<h4>@lang('gang.attackMaxLevel')</h4>

				@else


					<p><strong>@lang('gang.upgradeCost'):</strong> ${{ $gang->attackUpgradeCost }}</p>

					{!! BootForm::open()->post() !!}
					{!! BootForm::token() !!}

					{!! BootForm::hidden('action')->value('upgrade') !!}
					{!! BootForm::hidden('type')->value('attack') !!}

					{!! BootForm::submit(trans('action.upgrade'), 'btn-primary')
						->addClass('center-block') !!}

					{!! BootForm::close() !!}

				@endif


			</div>
		</div>
	</div>
	<div class="col-xs-12 col-sm-4">

		<div class="panel panel-default">
			<div class="panel-heading"><h5><strong>@lang('gang.upgradeAccomodation')</strong></h5></div>
			<div class="panel-body text-center">




				@if($gang->accomodationLevel >= $gang->accomodationMaxLevel)


					<h4>@lang('gang.accomodationMaxLevel')</h4>

				@else

					<p><strong>@lang('gang.upgradeCost'):</strong> ${{ $gang->accomodationUpgradeCost }}</p>

					{!! BootForm::open()->post() !!}
					{!! BootForm::token() !!}

					{!! BootForm::hidden('action')->value('upgrade') !!}
					{!! BootForm::hidden('type')->value('accomodation') !!}

					{!! BootForm::submit(trans('action.upgrade'), 'btn-primary')
						->addClass('center-block') !!}

					{!! BootForm::close() !!}

				@endif


			</div>
		</div>
	</div>
	<div class="col-xs-12 col-sm-4">

		<div class="panel panel-default">
			<div class="panel-heading"><h5><strong>@lang('gang.upgradeDefense')</strong></h5></div>
			<div class="panel-body text-center">



				@if($gang->defenseLevel >= $gang->defenseMaxLevel)


					<h4>@lang('gang.defenseMaxLevel')</h4>

				@else

					<p><strong>@lang('gang.upgradeCost'):</strong> ${{ $gang->defenseUpgradeCost }}</p>

					{!! BootForm::open()->post() !!}
					{!! BootForm::token() !!}

					{!! BootForm::hidden('action')->value('upgrade') !!}
					{!! BootForm::hidden('type')->value('defense') !!}

					{!! BootForm::submit(trans('action.upgrade'), 'btn-primary')
						->addClass('center-block') !!}

					{!! BootForm::close() !!}

				@endif


			</div>
		</div>
	</div>
</div>
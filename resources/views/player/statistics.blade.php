@extends('player.base')


@section('tab-content')

<div class="well">

	<div class="row">
		<div class="col-xs-12 col-sm-6">
			
			<img class="img-full center-block" src="{{ $player->avatar }}"/>


			<div class="panel panel-default">
				<div class="panel-body">

		
					<h4 class="text-center"><strong>{{ $player->name }}</strong></h4>

					<div class="row">
						<div class="col-xs-4 text-right">

							<strong>@lang('statistic.level')</strong>
						</div>
						<div class="col-xs-8 text-left">
							
							{!! entity('progressGroup')
								->appendAddon('<span class="level">' . $player->level . '</span>')
								->append(entity('progress')
									->style('info')
									->min(0)
									->max($player->maxExperience)
									->now($player->experience)
									->addClass('experience-bar')
								) !!}
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
							
							<strong>@lang('statistic.plantatorLevel')</strong>
						</div>
						<div class="col-xs-8 text-left">
							
							{!! entity('progressGroup')
								->appendAddon('<span class="plantator-level">' . $player->plantatorLevel . '</span>')
								->append(entity('progress')
									->style('success')
									->min(0)
									->max($player->plantatorMaxExperience)
									->now($player->plantatorExperience)
									->addClass('plantator-bar')
								) !!}
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">

							<strong>@lang('statistic.smugglerLevel')</strong>
						</div>
						<div class="col-xs-8 text-left">
							
							{!! entity('progressGroup')
								->appendAddon('<span class="smuggler-level">' . $player->smugglerLevel . '</span>')
								->append(entity('progress')
									->min(0)
									->max($player->smugglerMaxExperience)
									->now($player->smugglerExperience)
									->addClass('smuggler-bar')
								) !!}
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">

							<strong>@lang('statistic.dealerLevel')</strong>
						</div>
						<div class="col-xs-8 text-left">
							
							{!! entity('progressGroup')
								->appendAddon('<span class="dealer-level">' . $player->dealerLevel . '</span>')
								->append(entity('progress')
									->style('danger')
									->min(0)
									->max($player->dealerMaxExperience)
									->now($player->dealerExperience)
									->addClass('dealer-bar')
								) !!}
						</div>
					</div>
				</div>
			</div>

		</div>








		<div class="col-xs-12 col-sm-6">
			
			<div class="panel panel-default">
				<div class="panel-body">



					@if($player->statisticPoints == 0)
					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.strength')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.strength">{{ $player->strength }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.perception')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.perception">{{ $player->perception }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.endurance')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.endurance">{{ $player->endurance }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.charisma')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.charisma">{{ $player->charisma }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.intelligence')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.intelligence">{{ $player->intelligence }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.agility')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.agility">{{ $player->agility }}</span>
						</div>
					</div>

					@else

						{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('player.statistics')) !!}

						{!! BootForm::number('<strong>' . trans('statistic.strength') . '</strong>', 'strength')->required()
							->min($player->strength)->defaultValue($player->strength)->addClass('statistic') !!}

						{!! BootForm::number('<strong>' . trans('statistic.perception') . '</strong>', 'perception')->required()
							->min($player->perception)->defaultValue($player->perception)->addClass('statistic') !!}

						{!! BootForm::number('<strong>' . trans('statistic.endurance') . '</strong>', 'endurance')->required()
							->min($player->endurance)->defaultValue($player->endurance)->addClass('statistic') !!}

						{!! BootForm::number('<strong>' . trans('statistic.charisma') . '</strong>', 'charisma')->required()
							->min($player->charisma)->defaultValue($player->charisma)->addClass('statistic') !!}

						{!! BootForm::number('<strong>' . trans('statistic.intelligence') . '</strong>', 'intelligence')->required()
							->min($player->intelligence)->defaultValue($player->intelligence)->addClass('statistic') !!}

						{!! BootForm::number('<strong>' . trans('statistic.agility') . '</strong>', 'agility')->required()
							->min($player->agility)->defaultValue($player->agility)->addClass('statistic') !!}

						{!! BootForm::staticInput('<strong>' . trans('statistic.statisticPoints') . '</strong>', 'statisticsPoints')
							->value($player->statisticPoints + $player->strength + $player->perception + $player->endurance + 
								$player->charisma + $player->intelligence + $player->agility) !!}

						{!! BootForm::submit(trans('action.save'), 'btn-primary') !!}

						{!! BootForm::close() !!}
					@endif



				</div>
			</div>









			<div class="panel panel-default">
				<div class="panel-body">

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.damage')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.minDamage">{{ $player->minDamage }}</span> - <span data-ng-bind="player.maxDamage">{{ $player->maxDamage }}</span>
						</div>
					</div>


					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.defense')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.defense">{{ $player->defense }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.speed')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.speed">{{ $player->speed }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.critChance')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.critChance">{{ $player->critChance }}</span>%
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.luck')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.luck">{{ $player->luck }}</span>%
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.respect')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.respect">{{ $player->respect }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.money')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							$<span data-ng-bind="player.money">{{ $player->money }}</span>
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.premiumPoints')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							<span data-ng-bind="player.premiumPoints">{{ $player->premiumPoints }}</span>pp
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.experienceModifier')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							+<span data-ng-bind="round((player.experienceModifier - 1) * 100, 2)">{{ Formatter::number(($player->experienceModifier - 1) * 100, 2) }}</span>%
						</div>
					</div>

					<div class="row">
						<div class="col-xs-4 text-right">
						
							<strong>@lang('statistic.moneyModifier')</strong>
						</div>
						<div class="col-xs-6 text-left">
						
							+<span data-ng-bind="round((player.moneyModifier - 1) * 100, 2)">{{ Formatter::number(($player->moneyModifier - 1) * 100, 2) }}</span>%
						</div>
					</div>

				</div>
			</div>






		</div>


	</div>
</div>


@endsection
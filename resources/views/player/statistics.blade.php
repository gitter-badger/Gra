@extends('player.base')


@section('tab-content')


{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('player.statistics')) !!}


{!! BootForm::staticInput('<strong>' . trans('player.name') . '</strong>')->value($player->name) !!}

<hr/>



{!! BootForm::staticInput('<strong>' . trans('statistic.level') . '</strong>')->value(entity('progressGroup')
	->appendAddon('<span class="level">' . $player->level . '</span>')->append(entity('progress')->style('info')->min(0)
	->max($player->maxExperience)->now($player->experience)->addClass('experience-bar'))) !!}



{!! BootForm::staticInput('<strong>' . trans('statistic.plantatorLevel') . '</strong>')->value(entity('progressGroup')
	->appendAddon('<span class="plantator-level">' . $player->plantatorLevel . '</span>')->append(entity('progress')->style('success')->min(0)
	->max($player->plantatorMaxExperience)->now($player->plantatorExperience)->addClass('plantator-bar'))) !!}


{!! BootForm::staticInput('<strong>' . trans('player.smugglerLevel') . '</strong>')->value(entity('progressGroup')
	->appendAddon('<span class="smuggler-level">' . $player->smugglerLevel . '</span>')->append(entity('progress')->min(0)
	->max($player->smugglerMaxExperience)->now($player->smugglerExperience)->addClass('smuggler-bar'))) !!}


{!! BootForm::staticInput('<strong>' . trans('statistic.dealerLevel') . '</strong>')->value(entity('progressGroup')
	->appendAddon('<span class="dealer-level">' . $player->dealerLevel . '</span>')->append(entity('progress')->style('danger')->min(0)
	->max($player->dealerMaxExperience)->now($player->dealerExperience)->addClass('dealer-bar'))) !!}

<hr/>

{!! BootForm::staticInput('<strong>' . trans('statistic.money') . '</strong>')->value('<span class="money">$' . $player->money . '</span>') !!}
{!! BootForm::staticInput('<strong>' . trans('statistic.premiumPoints') . '</strong>')->value('<span class="premiumPoints">' . $player->premiumPoints . 'pp</span>') !!}

@if($player->statisticPoints > 0)

{!! BootForm::staticInput('<strong>' . trans('statistic.statisticPoints') . '</strong>', 'statisticsPoints')
	->value($player->statisticPoints + $player->strength + $player->perception + $player->endurance + $player->charisma + $player->intelligence + $player->agility) !!}

@else

{!! BootForm::staticInput('<strong>' . trans('statistic.statisticPoints') . '</strong>')
	->value('<span class="statisticPoints">' . $player->statisticPoints . '</span>') !!}

@endif

{!! BootForm::staticInput('<strong>' . trans('statistic.talentPoints') . '</strong>')->value('<span class="talentPoints">' . $player->talentPoints . '</span>') !!}


<hr/>

@if($player->statisticPoints > 0)




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

{!! BootForm::staticInput('<strong>' . trans('statistic.luck') . '</strong>')->value('<span class="luck">' . $player->luck . '%</span>') !!}

{!! BootForm::submit(trans('action.save'), 'btn-primary')->addClass('text-center') !!}

@else

{!! BootForm::staticInput('<strong>' . trans('statistic.strength') . '</strong>')->value('<span class="strength">' . $player->strength . '</span>') !!}
{!! BootForm::staticInput('<strong>' . trans('statistic.perception') . '</strong>')->value('<span class="perception">' . $player->perception . '</span>') !!}
{!! BootForm::staticInput('<strong>' . trans('statistic.endurance') . '</strong>')->value('<span class="endurance">' . $player->endurance . '</span>') !!}
{!! BootForm::staticInput('<strong>' . trans('statistic.charisma') . '</strong>')->value('<span class="charisma">' . $player->charisma . '</span>') !!}
{!! BootForm::staticInput('<strong>' . trans('statistic.intelligence') . '</strong>')->value('<span class="intelligence">' . $player->intelligence . '</span>') !!}
{!! BootForm::staticInput('<strong>' . trans('statistic.agility') . '</strong>')->value('<span class="agility">' . $player->agility . '</span>') !!}
{!! BootForm::staticInput('<strong>' . trans('statistic.luck') . '</strong>')->value('<span class="luck">' . $player->luck . '%</span>') !!}


@endif

{!! BootForm::close() !!}



@endsection
@extends('app')





@section('content')

<div class="panel panel-default">
	<div class="panel-body">

		{!! BootForm::open()->post()->action(route('player.save')) !!}
		{!! BootForm::token() !!}

		{!! BootForm::text(trans('player.name'), 'name')->required()->min(4)->max(32) !!}

		{!! BootForm::staticInput(trans('statistic.statPoints'), 'statisticsPoints')->value($points) !!}

		
		{!! BootForm::number(trans('statistic.strength'), 'strength')->required()->min(0)->defaultValue(0)->addClass('statistic') !!}
		{!! BootForm::number(trans('statistic.perception'), 'perception')->required()->min(0)->defaultValue(0)->addClass('statistic') !!}
		{!! BootForm::number(trans('statistic.endurance'), 'endurance')->required()->min(0)->defaultValue(0)->addClass('statistic') !!}
		{!! BootForm::number(trans('statistic.charisma'), 'charisma')->required()->min(0)->defaultValue(0)->addClass('statistic') !!}
		{!! BootForm::number(trans('statistic.intelligence'), 'intelligence')->required()->min(0)->defaultValue(0)->addClass('statistic') !!}
		{!! BootForm::number(trans('statistic.agility'), 'agility')->required()->min(0)->defaultValue(0)->addClass('statistic') !!}


		<div class="center-block">
			<a href="{{ route('world.list') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>

			{!! BootForm::submit(trans('player.create'), 'btn-primary') !!}
		</div>


		{!! BootForm::close() !!}
	</div>
</div>

@endsection
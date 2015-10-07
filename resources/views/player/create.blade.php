@extends('app')





@section('content')

<div class="panel panel-default">
	<div class="panel-body text-center">

		{!! BootForm::open()->post()->action(route('player.save')) !!}
		{!! BootForm::token() !!}



		<div class="row">

			<div class="col-xs-4">

				{!! BootForm::hidden('avatar')->value(0)->id('avatar') !!}

				<img class="avatar-preview" src=""/>

				<div class="row">

					@foreach($avatars as $id => $avatar)
						<div class="col-xs-6 col-sm-4 col-md-2">
							
							<img class="img-responsive avatar center-block" src="{{ asset('images/avatars/' . $avatar) }}" data-avatar="{{ $id }}"/>
						</div>
					@endforeach
				</div>
			</div>
			<div class="col-xs-8">

				<div class="row">



					<div class="col-xs-12">

						{!! BootForm::text(trans('player.name'), 'name')->required()->min(4)->max(32) !!}
					</div>


					<div class="col-xs-12 col-sm-6">

						{!! BootForm::number(trans('statistic.strength'), 'strength')->required()->min(0)->defaultValue(0)->addClass('statistic rollable resetable') !!}
					</div>

						
					<div class="col-xs-12 col-sm-6">

						{!! BootForm::number(trans('statistic.perception'), 'perception')->required()->min(0)->defaultValue(0)->addClass('statistic rollable resetable') !!}
					</div>


					<div class="col-xs-12 col-sm-6">

						{!! BootForm::number(trans('statistic.endurance'), 'endurance')->required()->min(0)->defaultValue(0)->addClass('statistic rollable resetable') !!}
					</div>


					<div class="col-xs-12 col-sm-6">

						{!! BootForm::number(trans('statistic.charisma'), 'charisma')->required()->min(0)->defaultValue(0)->addClass('statistic rollable resetable') !!}
					</div>


					<div class="col-xs-12 col-sm-6">

						{!! BootForm::number(trans('statistic.intelligence'), 'intelligence')->required()->min(0)->defaultValue(0)->addClass('statistic rollable resetable') !!}
					</div>


					<div class="col-xs-12 col-sm-6">

						{!! BootForm::number(trans('statistic.agility'), 'agility')->required()->min(0)->defaultValue(0)->addClass('statistic rollable resetable') !!}
					</div>

					<div class="col-xs-12">

						{!! BootForm::staticInput(trans('statistic.statisticPoints'), 'statisticsPoints')->value($points) !!}
					</div>


					<div class="col-xs-12">
						<div class="center-block">

							<div class="btn btn-default statRoller">@lang('action.roll')</div>
							<div class="btn btn-default statReseter">@lang('action.reset')</div>
						</div>
					</div>
				</div>
				
			</div>

			<div class="col-xs-12">

				<a href="{{ route('world.list') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>

				{!! BootForm::submit(trans('action.create'), 'btn-primary') !!}
			</div>
		</div>


		{!! BootForm::close() !!}
	</div>
</div>

@endsection
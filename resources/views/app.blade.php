@section('scripts')


	<script type="text/javascript" src="{{ asset('/js/app.js') }}"></script>
@endsection


@section('topbar')

@if(isset($player))

<div class="panel panel-default">
	<div class="panel-body">

		<div class="row text-center">
			<div class="col-xs-12 col-sm-6 col-md-3">
				<p>
					<strong>@lang('statistic.health'):</strong><br/>

					<div class="progress-group">
						{!! entity('progress')
							->addClass('health-bar')
							->min(0)
							->now($player->health)
							->max($player->maxHealth)
							->style('danger')
						!!}

						{!! entity('timer') 
							->addClass('health-timer')
							->addClass('progress-xs')
							->min($player->healthUpdate)
							->max($player->nextHealthUpdate)
							->reversed(false)
							->reload(false)
							->labelVisible(false)
						!!}
					</div>
				</p>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-3">
				<p>
					<strong>@lang('statistic.energy'):</strong><br/>

					<div class="progress-group">
						{!! entity('progress')
							->addClass('energy-bar')
							->min(0)
							->now($player->energy)
							->max($player->maxEnergy)
							->style('success') 
						!!}

						{!! entity('timer') 
							->addClass('energy-timer')
							->addClass('progress-xs')
							->min($player->energyUpdate)
							->max($player->nextEnergyUpdate)
							->reversed(false)
							->reload(false)
							->labelVisible(false)
						!!}
					</div>
				</p>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-3">
				<p>
					<strong>@lang('statistic.experience'):</strong><br/>

					<div class="progress-group">
						{!! entity('progress')
							->addClass('experience-bar')
							->addClass('progress-md')
							->min(0)
							->now($player->experience)
							->max($player->maxExperience)
							->style('info') 
						!!}
					</div>
				</p>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-3">
				<p>
					<strong>@lang('statistic.wanted'):</strong><br/>

					<div class="progress-group">
						{!! entity('progress')
							->addClass('wanted-bar')
							->min(0)
							->now($player->wanted)
							->max(6)
							->style('warning') 
						!!}

						{!! entity('timer') 
							->addClass('wanted-timer')
							->addClass('progress-xs')
							->min($player->wantedUpdate)
							->max($player->nextWantedUpdate)
							->reversed(true)
							->reload(false)
							->labelVisible(false)
						!!}
					</div>
				</p>
			</div>
		</div>


	</div>
</div>



@endif

@endsection



<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>HempEmpire - Alpha</title>

	<link href="{{ asset('/css/app.css') }}" rel="stylesheet">

	<?php

	$hour = date('H');
	$folder = null;

	if($hour >= 20 || $hour < 8)
	{
		$folder = 'night';
	}
	else
	{
		$folder = 'day';
	}

	?>



	<!-- Fonts -->
	<link href="{{ asset('/css/fonts/roboto.css') }}" rel="stylesheet" type="text/css">
	<link href="{{ asset('/css/fonts/flaticon.css') }}" rel="stylesheet" type="text/css">

	<!-- Bootstrap -->
	<link href="{{ asset('/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css">
	<link href="{{ asset('/css/' . $folder . '/theme.css') }}" rel="stylesheet" type="text/css">

	<!-- JQuery UI -->
	<link href="{{ asset('/css/jquery-ui.min.css') }}" rel="stylesheet" type="text/css">
	<link href="{{ asset('/css/' . $folder . '/jquery-ui.theme.min.css') }}" rel="stylesheet" type="text/css">

	<link href="{{ asset('/css/ui.notify.css') }}" rel="stylesheet" type="text/css">
	<link href="{{ asset('/css/app.css') }}" rel="stylesheet" type="text/css">



	<script src="{{ asset('/js/jquery.min.js') }}"></script>
	<script src="{{ asset('/js/bootstrap.min.js') }}"></script>
	<script src="{{ asset('/js/angular.min.js') }}"></script>
	<script src="{{ asset('/js/jquery-ui.js') }}"></script>
	<!--script src="{{ asset('/js/jquery.notify.js') }}"></script-->
	<script src="{{ asset('/js/bootstrap-notify.min.js') }}"></script>
	<script src="{{ asset('/js/jquery.mousewheel.js') }}"></script>





</head>
<body>
	@if(isset($player))


	<nav id="mainNav" class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">

			<div class="navbar-header navbar-left">

				{!! BootForm::open()->post()->addClass('navbar-form navbar-left')->addClass(is_null($player->place) || $player->isBusy || !isCurrentRoute('game') ? 'invisible' : null) !!}
				{!! BootForm::token() !!}
				{!! BootForm::hidden('place')->value(null) !!}


				<button type="submit" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</button>

				{!! BootForm::close() !!}


				<div class="btn-group navbar-left">

					{!! entity('navItem') 
						->icon('home')
						->url(route('game'))
						->text(is_null($player->place) ? $player->location->getTitle() : $player->place->getTitle()) !!}

					<div class="btn-group">

						{!! entity('navItem') 
							->icon('user')
							->url(route('player.index'))
							->text($player->name) !!}

						<button type="button" class="btn btn-{!! isCurrentRoute('player.index') ? 'primary' : 'default' !!} navbar-btn dropdown-toggle" data-toggle="dropdown">
    						<span class="caret"></span>
						</button>

						<ul class="dropdown-menu">

							<li {!! isCurrentRoute('player.statistics') ? ' class="active"' : '' !!}><a href="{{ route('player.statistics') }}">@lang('player.statistics')</a></li>
							<li {!! isCurrentRoute('player.items') ? ' class="active"' : '' !!}><a href="{{ route('player.items') }}">@lang('player.items')</a></li>
						</ul>
					</div>

					{!! entity('navItem') 
						->icon('envelope')
						->url(route('message.index'))
						->text(trans('navigation.messages'))
						->append(' <span class="badge messages">' . $player->messagesCount . '</span>') !!}
					
					{!! entity('navItem') 
						->icon('exclamation-sign')
						->url(route('reports.index'))
						->text(trans('navigation.reports'))
						->append(' <span class="badge reports">' . $player->reportsCount . '</span>') !!}

					{!! entity('navItem') 
						->icon('usd')
						->url(route('premiumShop'))
						->text(trans('navigation.premiumShop')) !!}


					{!! entity('navItem') 
						->icon('globe')
						->url(route('world.select'))
						->text($player->world->getTitle()) !!}

					@if($player->user->admin)

					{!! entity('navItem') 
						->icon('dashboard')
						->url(url('admin'))
						->text(trans('navigation.adminDashboard')) !!}

					@endif
					
					{!! entity('navItem') 
						->icon('lock')
						->url(route('user.logout'))
						->text(trans('navigation.logout')) !!}
				</div>

				<div class="navbar-right">
					<p class="navbar-text">
						<img src="{{ $player->avatar }}" class="avatar-small"/>
						<strong title="@lang('player.name')">{{ $player->name }} </strong> 
						<span class="badge level" title="@lang('statistic.level')">{{ $player->level }}</span>
						<span class="badge plantator-level" title="@lang('statistic.plantatorLevel')">{{ $player->plantatorLevel }}</span>
						<span class="badge smuggler-level" title="@lang('statistic.smugglerLevel')">{{ $player->smugglerLevel }}</span>
						<span class="badge dealer-level" title="@lang('statistic.dealerLevel')">{{ $player->dealerLevel }}</span>
					</p>
					<p class="navbar-text money" title="@lang('statistic.money')">{{ Formatter::money($player->money) }}</p>
					<p class="navbar-text" title="@lang('statistic.premiumPoints')">{{ $player->premiumPoints }}pp</p>
					<p class="navbar-text luck" title="@lang('statistic.luck')">{{ $player->luck }}%</p>
				</div>
			</div>

		
		</div>
	</nav>



	@endif


	<div class="container">

		<div class="fluid-container">

			@yield('topbar')
		</div>

		<div class="fluid-container">

			{!! Message::renderAll() !!}
			@yield('content')
		</div>

		<div class="fluid-container">

			@yield('footer')
		</div>
	</div>


	@yield('styles')
	@yield('scripts')
</body>
</html>

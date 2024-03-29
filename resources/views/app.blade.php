
@section('footerF')
	<div class="footerF col-md-12">
	@if(isset($player))

		<button type="button" id="helpBtn" class="btn btn-default pull-left">?</button>
	@endif
	
	<p class="pull-right footerF__time current-time">{{ date('Y-m-d H:i:s') }}</p>
	</div>
@endsection

@section('footerFBox')

<div class="footerFBox col-md-12">
				<div class="footerFBox__info col-md-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat adipisci ullam, expedita harum totam asperiores nesciunt dolorum modi aliquid molestiae et, repudiandae voluptatibus quae magnam vel eius labore maxime voluptas?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio id, iure dicta nesciunt sit illo quo modi hic numquam aut ea nihil, eaque a magni similique. Harum asperiores ab, soluta.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus at, fugit assumenda laboriosam cupiditate tempora asperiores culpa ipsum temporibus eveniet, debitis corporis fuga modi provident labore, dolore. Veniam, fuga officiis!</div>

				<ul class="footerFBox__ul col-md-3">
					<li class="footerFBox__ul__item footerFBox__ul__item--panel">Statystyki</li>
					<li class="footerFBox__ul__item"><a href="">lorem ipsum</a></li>
					<li class="footerFBox__ul__item"><a href="">Dolor dd ipsum</a></li>
					<li class="footerFBox__ul__item"><a href="">lorem dfsdfs ipsum</a></li>
					<li class="footerFBox__ul__item"><a href="">Tekst lorem</a></li>
					<li class="footerFBox__ul__item"><a href="">lorem ipsum</a></li>
				</ul>

				<ul class="footerFBox__ul col-md-3">
					<li class="footerFBox__ul__item footerFBox__ul__item--panel">Statystyki</li>
					<li class="footerFBox__ul__item"><a href="">lorem ipsum</a></li>
					<li class="footerFBox__ul__item"><a href="">Dolor dd ipsum</a></li>
					<li class="footerFBox__ul__item"><a href="">lorem dfsdfs ipsum</a></li>
					<li class="footerFBox__ul__item"><a href="">Tekst lorem</a></li>
					<li class="footerFBox__ul__item"><a href="">lorem ipsum</a></li>
				</ul>

				<ul class="footerFBox__ul col-md-2">
					<li class="footerFBox__ul__item footerFBox__ul__item--stats">Statystyki</li>
					<li class="footerFBox__ul__item">lorem ipsum</li>
					<li class="footerFBox__ul__item">Dolor dd ipsum</li>
					<li class="footerFBox__ul__item">lorem dfsdfs ipsum</li>
					<li class="footerFBox__ul__item">lorem ipsum</li>
				</ul>
			</div>
@endsection


@section('topbar')

@if(isset($player))

<div>
	<div class="panelF">

		<div class="row text-center">
			<div class="col-xs-12 col-sm-6 col-md-3">
				<p class="panelF__text">
					<strong>@lang('statistic.health'):</strong><br/>

					<div class="progress-group" title="@lang('statistic.health')">

						<div class="progress-row" data-help="@lang('help.health.bar')">

							{!! entity('progress')
								->addClass('health-bar panelF__progress')
								->min(0)
								->now($player->health)
								->max($player->maxHealth)
								->style('health')
							!!}
						</div>

						<div class="progress-row" data-help="@lang('help.health.timer')">

							{!! entity('timer') 
								->addClass('health-timer')
								->addClass('progress-xs')
								->addClass('panelF__progress__timer')
								->min($player->healthUpdate)
								->max($player->nextHealthUpdate)
								->reversed(false)
								->reload(false)
								->labelVisible(false)
							!!}
						</div>
					</div>
				</p>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-3">
				<p class="panelF__text">
					<strong>@lang('statistic.energy'):</strong><br/>

					<div class="progress-group" title="@lang('statistic.energy')">

						<div class="progress-row" data-help="@lang('help.energy.bar')">
							
							{!! entity('progress')
								->addClass('energy-bar panelF__progress')
								->min(0)
								->now($player->energy)
								->max($player->maxEnergy)
								->style('energy') 
							!!}
						</div>

						<div class="progress-row" data-help="@lang('help.energy.timer')">
							
							{!! entity('timer') 
								->addClass('energy-timer')
								->addClass('progress-xs')
								->addClass('panelF__progress__timer')
								->min($player->energyUpdate)
								->max($player->nextEnergyUpdate)
								->reversed(false)
								->reload(false)
								->labelVisible(false)
							!!}
						</div>
					</div>
				</p>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-3">
				<p class="panelF__text">
					<strong>@lang('statistic.experience'):</strong><br/>

					<div class="progress-group" title="@lang('statistic.experience')">

						<div class="progress-row" data-help="@lang('help.experience.bar')">
						
							{!! entity('progress')
								->addClass('experience-bar panelF__progress')
								->addClass('progress-md')
								->min(0)
								->now($player->experience)
								->max($player->maxExperience)
								->style('experience') 
							!!}
						</div>
					</div>
				</p>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-3">
				<p class="panelF__text">
					<strong>@lang('statistic.wanted'):</strong><br/>

					<div class="progress-group" title="@lang('statistic.wanted')">


						<div class="progress-row" data-help="@lang('help.wanted.bar')">
							
							{!! entity('progress')
								->addClass('wanted-bar panelF__progress')
								->min(0)
								->now($player->wanted)
								->max(6)
								->style('wanted') 
							!!}
						</div>

						<div class="progress-row" data-help="@lang('help.wanted.timer')">
							
							{!! entity('timer') 
								->addClass('wanted-timer')
								->addClass('progress-xs')
								->addClass('panelF__progress__timer')
								->min($player->wantedUpdate)
								->max($player->nextWantedUpdate)
								->reversed(true)
								->reload(false)
								->labelVisible(false)
							!!}
						</div>
					</div>
				</p>
			</div>
		</div>
	</div>
</div>



@endif

@endsection


@section('meta')

	
@endsection

@section('scripts')


	@if(Config::get('app.cdn'))


		<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
		<script src="https://code.angularjs.org/1.4.4/angular.min.js"></script>
	@else

		@if(Config::get('app.minified'))


			<script src="{{ asset('/js/jquery.min.js') }}"></script>
			<script src="{{ asset('/js/bootstrap.min.js') }}"></script>
			<script src="{{ asset('/js/angular.min.js') }}"></script>
		@else

			<script src="{{ asset('/js/jquery.js') }}"></script>
			<script src="{{ asset('/js/bootstrap.js') }}"></script>
			<script src="{{ asset('/js/angular.js') }}"></script>
		@endif
	@endif


	<script type="text/javascript" src="{{ asset('/js/language.js') }}"></script>

	
	@if(Config::get('app.minified'))

		<script src="{{ asset('/js/jquery.mousewheel.min.js') }}"></script>
		<script src="{{ asset('/js/bootstrap-notify.min.js') }}"></script>
		<script src="{{ asset('/js/app.min.js') }}"></script>
	@else

		<script src="{{ asset('/js/jquery.mousewheel.js') }}"></script>
		<script src="{{ asset('/js/bootstrap-notify.js') }}"></script>
		<script src="{{ asset('/js/app.js') }}"></script>
	@endif

	@if(isset($player))


		<script src="{{ asset('/js/player.js') }}"></script>
	@endif


@endsection

@section('styles')



	@if(Config::get('app.cdn') && Config::get('app.bootstrapCdn'))


		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">
	@else

		@if(Config::get('app.minified'))

			<link href="{{ asset('/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css">
		@else

			<link href="{{ asset('/css/bootstrap.css') }}" rel="stylesheet" type="text/css">
		@endif


	@endif

	
	@if(Config::get('app.minified'))

		<link href="{{ asset('/css/theme.min.css') }}" rel="stylesheet" type="text/css">
		<link href="{{ asset('/sass/custom_style.css') }}" rel="stylesheet" type="text/css">
		<link href="{{ asset('/css/app.css') }}" rel="stylesheet" type="text/css">
		<link href="{{ asset('/css/sticky-footer.css') }}" rel="stylesheet" type="text/css">
	@else
		<link href="{{ asset('/css/theme.css') }}" rel="stylesheet" type="text/css">
		<link href="{{ asset('/sass/custom_style.css') }}" rel="stylesheet" type="text/css">
		<link href="{{ asset('/css/app.css') }}" rel="stylesheet" type="text/css">
		<link href="{{ asset('/css/sticky-footer.css') }}" rel="stylesheet" type="text/css">
	@endif


@endsection


@section('navigation')

	@include('navigation')
@endsection




<!DOCTYPE html>
<html lang="en" data-ng-app="game" data-ng-controller="GameController">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		@yield('meta')

		<title>HempEmpire - Alpha</title>

		@yield('styles')
		@yield('scripts')
	</head>


	<body data-ng-controller="PlayerController as player" data-tutorial="true" data-tutorial-name="general">


		@yield('navigation')

		<div id="wrap">
			<div id="mainContent" class="container">
				<div class="row">
					<div class="col-md-12">
						@yield('topbar')
					</div>
				</div>

				<div class="row">
					<div class="col-md-12">
						{!! Message::renderAll() !!}
						@yield('content')
					</div>
				</div>
			</div>
		</div>

		<div class="fluid-container">
			@yield('footerFBox')
			@yield('footerF')
		</div>

	</body>
</html>

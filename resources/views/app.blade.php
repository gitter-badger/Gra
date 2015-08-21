@section('scripts')


	<script type="text/javascript" src="{{ asset('/js/app.js') }}"></script>
@endsection

@section('footer')


	<p class="text-right current-time">{{ date('Y-m-d H:i:s') }}</p>
@endsection


@section('topbar')

@if(isset($player))

<div class="panel panel-default">
	<div class="panel-body">

		<div class="row text-center">
			<div class="col-xs-12 col-sm-6 col-md-3">
				<p>
					<strong>@lang('statistic.health'):</strong><br/>

					<div class="progress-group" title="@lang('statistic.health')">

						<div class="progress-row">

							{!! entity('progress')
								->addClass('health-bar')
								->min(0)
								->now($player->health)
								->max($player->maxHealth)
								->style('health')
							!!}
						</div>

						<div class="progress-row">

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
					</div>
				</p>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-3">
				<p>
					<strong>@lang('statistic.energy'):</strong><br/>

					<div class="progress-group" title="@lang('statistic.energy')">

						<div class="progress-row">
							
							{!! entity('progress')
								->addClass('energy-bar')
								->min(0)
								->now($player->energy)
								->max($player->maxEnergy)
								->style('energy') 
							!!}
						</div>

						<div class="progress-row">
							
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
					</div>
				</p>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-3">
				<p>
					<strong>@lang('statistic.experience'):</strong><br/>

					<div class="progress-group" title="@lang('statistic.experience')">

						<div class="progress-row">
						
							{!! entity('progress')
								->addClass('experience-bar')
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
				<p>
					<strong>@lang('statistic.wanted'):</strong><br/>

					<div class="progress-group" title="@lang('statistic.wanted')">


						<div class="progress-row">
							
							{!! entity('progress')
								->addClass('wanted-bar')
								->min(0)
								->now($player->wanted)
								->max(6)
								->style('wanted') 
							!!}
						</div>


						<div class="progress-row">
							
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



<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	@yield('meta')

	<title>HempEmpire - Alpha</title>

	<!--link href="{{ asset('/css/app.css') }}" rel="stylesheet"-->


	<!-- Fonts -->
	<link href="{{ asset('/css/fonts/roboto.css') }}" rel="stylesheet" type="text/css">
	<link href="{{ asset('/css/fonts/flaticon.css') }}" rel="stylesheet" type="text/css">



	@if(Config::get('app.debug'))

		<!-- Bootstrap -->
		<link href="{{ asset('/css/bootstrap.css') }}" rel="stylesheet" type="text/css">
		<link href="{{ asset('/css/theme.css') }}" rel="stylesheet" type="text/css">

		<script src="{{ asset('/js/jquery.js') }}"></script>
		<script src="{{ asset('/js/bootstrap.js') }}"></script>
		<script src="{{ asset('/js/angular.js') }}"></script>
		<script src="{{ asset('/js/jquery.mousewheel.js') }}"></script>
		<script src="{{ asset('/js/bootstrap-notify.js') }}"></script>
		<script src="{{ asset('/js/app.js') }}"></script>
	@else


		<link href="{{ asset('/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css">
		<link href="{{ asset('/css/theme.min.css') }}" rel="stylesheet" type="text/css">

		<script src="{{ asset('/js/jquery.min.js') }}"></script>
		<script src="{{ asset('/js/bootstrap.min.js') }}"></script>
		<script src="{{ asset('/js/angular.min.js') }}"></script>
		<script src="{{ asset('/js/jquery.mousewheel.min.js') }}"></script>
		<script src="{{ asset('/js/bootstrap-notify.min.js') }}"></script>
		<script src="{{ asset('/js/app.min.js') }}"></script>
	@endif






</head>


<body data-ng-app="game" data-ng-controller="player">
	<script type="text/javascript">

	(function() {

		var app = angular.module('game', []);

	})();

	</script>



	@include('navigation')


	


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


	<script type="text/javascript">

		(function() {

			var app = angular.module('game');

			app.controller('player', function($scope) {

				@if(isset($player))
				$scope.player = {

					level: {{ $player->level }},
					plantatorLevel: {{ $player->plantatorLevel }},
					smugglerLevel: {{ $player->smugglerLevel }},
					dealerLevel: {{ $player->dealerLevel }},
					strength: {{ $player->strength }},
					perception: {{ $player->perception }},
					endurance: {{ $player->endurance }},
					charisma: {{ $player->charisma }},
					intelligence: {{ $player->intelligence }},
					agility: {{ $player->agility }},
					luck: {{ $player->luck }},
					money: {{ $player->money }},
					premiumPoints: {{ $player->premiumPoints }},
					reports: {{ $player->reportsCount }},
					messages: {{ $player->messagesCount }},
					respect: {{ $player->respect }},
					weight: {{ $player->weight }},
					capacity: {{ $player->capacity }},
					experienceModifier: {{ $player->experienceModifier }},
					moneyModifier: {{ $player->moneyModifier }},
				};
				@else
				$scope.player = null;

				@endif


				$scope.round = function(value, precision) {

					var n, v, r;

					if(precision === null || typeof precision == 'undefined')
						precision = 0;

					n = Math.pow(10, precision);
					v = value * n;
					r = Math.round(v)
					v = r / n;

					return v;
				};
			});

		})();

	</script>


	@yield('styles')
	@yield('scripts')


</body>
</html>

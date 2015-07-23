<div>
	<h4><strong>@lang('hospital.title')</strong></h4>
	<div class="well text-center">

		<div class="row" data-ng-app="game" data-ng-controller="hospital">

			<div class="col-xs-6">
			
				<div class="panel panel-default">
					<div class="panel-heading"><h4>@lang('hospital.normal')</h4></div>
					<div class="panel-body">

						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}

						{!! BootForm::hidden('action')->value('treat') !!}
						{!! BootForm::hidden('treat')->value('normal') !!}

						{!! BootForm::range('<strong>' . trans('hospital.health') . '</strong>', 'health')
							->min(1)->max($player->maxHealth - $player->health)->data('ng-model', 'normalHealth')->defaultValue($player->maxHealth - $player->health) !!}

						{!! BootForm::staticInput('<strong>' . trans('hospital.price') . '</strong>')
							->data('ng-bind', 'normalPrice()') !!}

						{!! BootForm::staticInput('<strong>' . trans('hospital.duration') . '</strong>')
							->data('ng-bind', 'normalDuration()') !!}

						{!! BootForm::submit(trans('action.treat'), 'btn-primary')
							->addClass('center-block') !!}

						{!! BootForm::close() !!}
					</div>
				</div>

			</div>

			<div class="col-xs-6">

				<div class="panel panel-default">
					<div class="panel-heading"><h4>@lang('hospital.fast')</h4></div>
					<div class="panel-body">
					   
						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}

						{!! BootForm::hidden('action')->value('treat') !!}
						{!! BootForm::hidden('treat')->value('fast') !!}

						{!! BootForm::range('<strong>' . trans('hospital.health') . '</strong>', 'health')
							->min(1)->max($player->maxHealth - $player->health)->data('ng-model', 'fastHealth')->defaultValue($player->maxHealth - $player->health) !!}

						{!! BootForm::staticInput('<strong>' . trans('hospital.price') . '</strong>')
							->data('ng-bind', 'fastPrice()') !!}

						{!! BootForm::staticInput('<strong>' . trans('hospital.duration') . '</strong>')
							->data('ng-bind', 'fastDuration()') !!}

						{!! BootForm::submit(trans('action.treat'), 'btn-primary')
							->addClass('center-block') !!}

						{!! BootForm::close() !!}
					</div>
				</div>

			</div>


		</div>


	</div>
</div>

<script type="text/javascript">
	
(function() {

	var app = angular.module('game', []);

	app.controller('hospital', function($scope) {

		$scope.normalHealth = $scope.fastHealth = {{ $player->maxHealth - $player->health }};


		$scope.normalPrice = function() {

			return '$' + ($scope.normalHealth * {{ $normalPrice }});
		};

		$scope.normalDuration = function() {

			return window.timeFormat($scope.normalHealth * {{ $normalSpeed }});
		};


		$scope.fastPrice = function() {

			return '$' + ($scope.fastHealth * {{ $fastPrice }});
		};

		$scope.fastDuration = function() {

			return window.timeFormat($scope.fastHealth * {{ $fastSpeed }});
		};
	});



})();


</script>
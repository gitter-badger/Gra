<div class="well">

<div class="row">
	<div class="col-xs-6 col-xs-offset-3">
		
		<div class="panel panel-default">
			<div class="panel-body text-center" data-ng-app="game" data-ng-controller="gambling">


				{!! BootForm::open()->post() !!}
				{!! BootForm::token() !!}
				{!! BootForm::hidden('action')->value('bet') !!}


				{!! BootForm::range('<strong>' . trans('gambling.bet') . '</strong>', 'value')
					->min($minBet)->max($maxBet)->data('ng-model', 'bet')->before('$')->value($minBet) !!}

				{!! BootForm::staticInput('<strong>' . trans('gambling.money') . '</strong>')
					->value('$<span data-ng-bind="money()"></span>') !!}



				{!! BootForm::submit(trans('gambling.gamble'), 'btn-primary')
					->addClass('center-block') !!}

				{!! BootForm::close() !!}


			</div>
		</div>

	</div>
</div>



</div>

<script type="text/javascript">

(function() {

	var app = angular.module('game', []);

	app.controller('gambling', function($scope) {

		$scope.exchange = {{ $exchange }};
		$scope.bet = {{ $minBet }};

		$scope.money = function() {

			return Math.round($scope.exchange * $scope.bet);
		};
	});



})();


</script>
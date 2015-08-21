<div data-tutorial="true" data-tutorial-name="dealing" data-ng-controller="dealing">

	<h4><strong>@lang('dealing.title')</strong></h4>
	<div class="well text-center">
		
		<div class="row">

			<div class="col-xs-12 col-md-6 col-md-offset-3">

				<div class="panel panel-default">
					<div class="panel-body">
					
						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}
						{!! BootForm::hidden('action')->value('deal') !!}

						<div class="text-center">

							<p><strong>@lang('dealing.energy')</strong>: <span data-ng-bind="energy()"></span></p>

							{!! BootForm::range('<strong>' . trans('dealing.price') . '</strong>:', 'price')
								->min($minPrice)->max($maxPrice)->value(round(($minPrice + $maxPrice) / 2))->before('$') !!}

							{!! BootForm::range('<strong>' . trans('dealing.duration') . '</strong>:', 'duration')
								->min($minDuration)->max($maxDuration)->value($minDuration)->after('0m')->data('ng-model', 'duration') !!}


							{!! BootForm::submit(trans('action.dealing'), 'btn-primary')
								->addClass('tutorial-step')
								->data('tutorial-index', 0)
								->attribute('title', trans('tutorial.dealing.deal.title'))
								->data('content', trans('tutorial.dealing.deal.content')) !!}
						</div>

						{!! BootForm::close() !!}
					</div>
				</div>



			</div>

		</div>
	</div>



</div>


<script type="text/javascript">

(function() {

	var app = angular.module('game');

	app.controller('dealing', function($scope) {

		$scope.energyCost = {{ $energy }};
		$scope.duration = {{ round(($minDuration + $maxDuration) / 2) }};

		$scope.energy = function() {

			return $scope.energyCost * $scope.duration;
		};
	});

})();

</script>


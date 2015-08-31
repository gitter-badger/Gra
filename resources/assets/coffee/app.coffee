





@app = angular.module('game', [])



@app.controller('GameController', ['$scope', ($scope) ->


	$scope.round = (value, precision) ->

		p = precision ? 0
		n = Math.pow(10, p)

		Math.round(value * n) / n

])



@app.controller('PlayerController', ['$scope', ($scope) ->


])


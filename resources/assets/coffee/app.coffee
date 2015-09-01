





@app = angular.module('game', [])



@app.controller('GameController', ['$scope', ($scope) ->


	$scope.round = (value, precision) ->

		p = precision ? 0
		n = Math.pow(10, p)

		Math.round(value * n) / n

])



@app.controller('PlayerController', ['$scope', ($scope) ->





	old = document.title
	update = () =>

		if @isBusy

			now = Math.round((new Date()).getTime() / 1000)
			left = Math.max(@jobEnd - now, 0)

			if left > 0

				document.title = window.timeFormat(left) + ' - ' + old
			else

				document.title = old

		setTimeout(update, 1000)



	update()

])


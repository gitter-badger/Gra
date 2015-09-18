

$(function() {
	
	var player = {!! $player->toJSON() !!};
	var scope = angular.element(document.body).scope();

	for(var name in player) {

		scope.player[name] = player[name];
	}

	scope.$apply();

});
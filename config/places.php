<?php

return [
	[
		'name' => 'tutorial-buletin-board',
		'image' => 'bulletin-board.jpg',
		'visible' => false,
		'components' => ['work'],
		'properties' => ['work' => ['groups' => 'tutorial-works', 'reset' => 604800, 'atOnce' => 1, 'perGroup' => 1]],
		'requires' => []
	],
	[
		'name' => 'tutorial-growshop',
		'image' => 'growshop.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'tutorial-growshop']],
		'requires' => ['quest:first-work']
	],
	[
		'name' => 'tutorial-plantation',
		'image' => 'plantation.jpg',
		'visible' => false,
		'components' => ['plantation'],
		'properties' => ['plantation' => ['light' => 1, 'ground' => 1, 'slots' => 1]],
		'requires' => ['quest:first-seed']
	],
	[
		'name' => 'tutorial-street',
		'image' => 'street.jpg',
		'visible' => false,
		'components' => ['dealing'],
		'properties' => ['dealing' => ['durationMin' => 1, 'durationMax' => 1, 'energy' => 10, 'minInterval' => 2000, 'maxInterval' => 2000, 'minStuff' => 15, 'maxStuff' => 15, 'burnChance' => 100]],
		'requires' => ['quest:first-plant']
	],
	[
		'name' => 'tutorial-bus-stop',
		'image' => 'bus-stop.jpg',
		'visible' => false,
		'components' => ['travel'],
		'properties' => ['travel' => ['cost' => 0.1, 'speed' => 4, 'available' => 'capital']],
		'requires' => ['quest:first-deal']
	],
	[
		'name' => 'warehouse',
		'image' => 'warehouse.jpg',
		'visible' => false,
		'components' => ['store', 'rent'],
		'properties' => ['store' => ['deny' => 'vehicle'], 'rent' => ['cost' => 1000, 'duration' => 604800]],
		'requires' => []
	],
	[
		'name' => 'garage',
		'image' => 'garage.jpg',
		'visible' => false,
		'components' => ['store', 'rent'],
		'properties' => ['store' => ['allow' => 'vehicle'], 'rent' => ['cost' => 1000, 'duration' => 604800]],
		'requires' => []
	],
	[
		'name' => 'bus-stop',
		'image' => 'bus-stop.jpg',
		'visible' => false,
		'components' => ['travel'],
		'properties' => ['travel' => ['cost' => 4, 'speed' => 20, 'available' => 'city,village']],
		'requires' => []
	],
	[
		'name' => 'train-station',
		'image' => 'train-station.jpg',
		'visible' => false,
		'components' => ['travel'],
		'properties' => ['travel' => ['cost' => 8, 'speed' => 40, 'available' => 'city']],
		'requires' => []
	],
	[
		'name' => 'bulletin-board',
		'image' => 'bulletin-board.jpg',
		'visible' => false,
		'components' => ['work'],
		'properties' => ['work' => ['groups' => 'bulletin-board, test', 'reset' => 86400, 'atOnce' => 2, 'perGroup' => 4]],
		'requires' => []
	],
	[
		'name' => 'plantation',
		'image' => 'plantation.jpg',
		'visible' => false,
		'components' => ['plantation'],
		'properties' => ['plantation' => ['light' => 1, 'ground' => 1, 'slots' => 5]],
		'requires' => []
	],
	[
		'name' => 'street',
		'image' => 'street.jpg',
		'visible' => false,
		'components' => ['dealing'],
		'properties' => ['dealing' => ['durationMin' => 1, 'durationMax' => 10, 'energy' => 10, 'minInterval' => 600, 'maxInterval' => 1800, 'minStuff' => 1, 'maxStuff' => 4, 'burnChance' => 25]],
		'requires' => []
	],
	[
		'name' => 'grocery-store',
		'image' => 'convenience-store.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'grocery-store', 'delivery' => 86400]],
		'requires' => []
	],
	[
		'name' => 'gun-shop',
		'image' => 'gun-shop.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'gun-shop', 'delivery' => 86400]],
		'requires' => []
	],
	[
		'name' => 'grow-shop',
		'image' => 'growshop.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'grow-shop', 'delivery' => 86400]],
		'requires' => []
	],
	[
		'name' => 'sport-shop',
		'image' => 'sport-shop.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'sport-shop', 'delivery' => 86400]],
		'requires' => []
	],
	[
		'name' => 'black-market',
		'image' => 'black-market.jpg',
		'visible' => false,
		'components' => ['market'],
		'properties' => ['market' => ['minPrice' => 50, 'maxPrice' => 100, 'allow' => 'stuff'], 'requires' => ['level:5']],
		'requires' => []
	],
	[
		'name' => 'toy-store',
		'image' => 'toy-store.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'toy-store', 'delivery' => 86400]],
		'requires' => []
	],
	[
		'name' => 'car-showroom',
		'image' => 'show-room.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'car-showroom', 'delivery' => 86400]],
		'requires' => []
	],
	[
		'name' => 'miscellaneous-store',
		'image' => 'miscellaneous-store.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'miscellaneous-store', 'delivery' => 86400]],
		'requires' => []
	],
	[
		'name' => 'motorcycle-shop',
		'image' => 'motorcycle-shop.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'motorcycle-shop', 'delivery' => 86400]],
		'requires' => []
	],
	[
		'name' => 'vehicle-exchange',
		'image' => 'vehicle-exchange.jpg',
		'visible' => false,
		'components' => ['market'],
		'properties' => ['market' => ['minPrice' => 33, 'maxPrice' => 200, 'allow' => 'vehicle']],
		'requires' => []
	],
	[
		'name' => 'outgoing-road',
		'image' => 'outgoing-road.jpg',
		'visible' => true,
		'components' => ['vehicleTravel'],
		'properties' => ['vehicleTravel' => ['available' => 'city, village']],
		'requires' => ['equiped:vehicle']
	],
	[
		'name' => 'police-station',
		'image' => 'police-station.jpg',
		'visible' => true,
		'components' => ['arrest'],
		'properties' => ['arrest' => ['duration' => 7200]],
		'requires' => []
	],
	[
		'name' => 'dump',
		'image' => 'dump.jpg',
		'visible' => true,
		'components' => ['work'],
		'properties' => ['work' => ['groups' => 'dump', 'reset' => 28800, 'atOnce' => 1, 'perGroup' => 1]],
		'requires' => []
	],
	[
		'name' => 'restaurant',
		'image' => 'restaurant.jpg',
		'visible' => true,
		'components' => ['investment'],
		'properties' => ['investment' => ['name' => 'restaurant']],
		'requires' => []
	],
];
?>
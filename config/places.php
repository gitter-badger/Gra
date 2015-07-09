<?php

return [
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
		'requires' => ['quest:first-deal']
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
		'requires' => ['quest:first-seed']
	],
	[
		'name' => 'street',
		'image' => 'street.jpg',
		'visible' => false,
		'components' => ['dealing'],
		'properties' => ['dealing' => ['durationMin' => 1, 'durationMax' => 10, 'energy' => 10, 'minInterval' => 600, 'maxInterval' => 1800, 'minStuff' => 1, 'maxStuff' => 2]],
		'requires' => ['quest:first-plant']
	],
	[
		'name' => 'grocery-store',
		'image' => 'convenience-store.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'grocery-store']],
		'requires' => []
	],
	[
		'name' => 'gun-shop',
		'image' => 'gun-shop.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'gun-shop']],
		'requires' => []
	],
	[
		'name' => 'grow-shop',
		'image' => 'growshop.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'grow-shop']],
		'requires' => ['quest:first-work']
	],
	[
		'name' => 'sport-shop',
		'image' => 'sport-shop.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'sport-shop']],
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
		'properties' => ['shop' => ['name' => 'toy-store']],
		'requires' => []
	],
	[
		'name' => 'car-showroom',
		'image' => 'show-room.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'car-showroom']],
		'requires' => []
	],
	[
		'name' => 'miscellaneous-store',
		'image' => 'miscellaneous-store.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'miscellaneous-store']],
		'requires' => []
	],
	[
		'name' => 'motorcycle-shop',
		'image' => 'motorcycle-shop.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'motorcycle-shop']],
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
];
?>
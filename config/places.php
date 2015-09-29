<?php

return [
	[
		'name' => 'tutorial-bulletin-board',
		'image' => 'bulletin-board.jpg',
		'visible' => true,
		'dangerous' => false,
		'components' => ['work'],
		'properties' => ['work' => ['groups' => 'tutorial', 'atOnce' => 1, 'perGroup' => 1, 'resetable' => 0, 'resetCost' => 0, 'resetCooldown' => 0]],
		'requires' => []
	],
	[
		'name' => 'tutorial-growshop',
		'image' => 'small-growshop.jpg',
		'visible' => false,
		'dangerous' => true,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'tutorial-growshop', 'items' => 2]],
		'requires' => ['quest:tutorial-work']
	],
	[
		'name' => 'tutorial-plantation',
		'image' => 'plantation.jpg',
		'visible' => false,
		'dangerous' => true,
		'components' => ['plantation'],
		'properties' => ['plantation' => ['light' => 1, 'ground' => 1, 'slots' => 2]],
		'requires' => ['quest:tutorial-seed']
	],
	[
		'name' => 'tutorial-square',
		'image' => 'small-square.jpg',
		'visible' => true,
		'dangerous' => true,
		'components' => ['dealing'],
		'properties' => ['dealing' => ['durationMin' => 1, 'durationMax' => 4, 'energy' => 5, 'minPrice' => 4, 'maxPrice' => 8, 'minInterval' => 600, 'maxInterval' => 1200, 'minStuff' => 1, 'maxStuff' => 5, 'beatChance' => 0, 'burnChance' => 10]],
		'requires' => ['quest:tutorial-harvest']
	],
	[
		'name' => 'tutorial-bus-station',
		'image' => 'bus-station.jpg',
		'visible' => true,
		'dangerous' => false,
		'components' => ['travel'],
		'properties' => ['travel' => ['cost' => 2, 'speed' => 25, 'available' => 'city']],
		'requires' => ['quest:tutorial-dealing']
	],
	[
		'name' => 'tutorial-grocery-store',
		'image' => 'grocery-store.jpg',
		'visible' => true,
		'dangerous' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'tutorial-shop', 'items' => 2]],
		'requires' => ['quest:tutorial-seed']
	],
	[
		'name' => 'small-growshop',
		'image' => 'small-growshop.jpg',
		'visible' => true,
		'dangerous' => true,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'small-growshop', 'delivery' => 28800, 'items' => 5, 'resetable' => 1, 'resetCost' => 5, 'resetCooldown' => 86400]],
		'requires' => []
	],
	[
		'name' => 'growshop',
		'image' => 'growshop.jpg',
		'visible' => true,
		'dangerous' => true,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'growshop', 'delivery' => 43200, 'items' => 10, 'resetable' => 1, 'resetCost' => 5, 'resetCooldown' => 86400]],
		'requires' => []
	],
];
?>
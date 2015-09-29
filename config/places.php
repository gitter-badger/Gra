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
		'properties' => ['dealing' => ['energy' => 5, 'minPrice' => 0.25, 'maxPrice' => 1.75, 'minClients' => 3, 'maxClients' => 5, 'duration' => 600, 'burnChance' => 10]],
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
	[
		'name' => 'tutorial-clinic',
		'image' => 'clinic.jpg',
		'visible' => true,
		'dangerous' => false,
		'components' => ['hospital'],
		'properties' => ['hospital' => ['normalSpeed' => 6, 'normalPrice' => 1, 'fastSpeed' => 3, 'fastPrice' => 3, 'normalAvailable' => 0, 'fastAvailable' => 0]],
		'requires' => ['blocked:']
	],
	[
		'name' => 'tutorial-arrest',
		'image' => 'arrest.jpg',
		'visible' => true,
		'dangerous' => false,
		'components' => ['arrest'],
		'properties' => ['arrest' => ['duration' => 100]],
		'requires' => ['blocked:']
	],
];
?>
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
		'name' => 'small-growshop',
		'image' => 'growshop.jpg',
		'visible' => false,
		'dangerous' => true,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'small-growshop', 'items' => 2]],
		'requires' => ['quest:tutorial-work']
	],
	[
		'name' => 'small-plantation',
		'image' => 'plantation.jpg',
		'visible' => false,
		'dangerous' => true,
		'components' => ['plantation'],
		'properties' => ['plantation' => ['light' => 1, 'ground' => 1, 'slots' => 2]],
		'requires' => ['quest:tutorial-seed']
	],
	[
		'name' => 'small-square',
		'image' => 'small-square.jpg',
		'visible' => true,
		'dangerous' => true,
		'components' => ['dealing'],
		'properties' => ['dealing' => ['durationMin' => 1, 'durationMax' => 4, 'energy' => 5, 'minPrice' => 4, 'maxPrice' => 8, 'minInterval' => 600, 'maxInterval' => 1200, 'minStuff' => 1, 'maxStuff' => 5, 'beatChance' => 0, 'burnChance' => 10]],
		'requires' => ['quest:tutorial-harvest']
	],
];
?>
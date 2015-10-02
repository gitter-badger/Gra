<?php

return [
	[
		'name' => 'mikes-house',
		'image' => 'apartment.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['npc'],
		'properties' => ['npc' => ['name' => 'mike']],
		'requires' => []
	],
	[
		'name' => 'tutorial-bulletin-board',
		'image' => 'bulletin-board.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['work'],
		'properties' => ['work' => ['groups' => 'tutorial', 'reset' => 600, 'atOnce' => 2, 'perGroup' => 2]],
		'requires' => ['during:comming-with-help']
	],
	[
		'name' => 'tutorial-square',
		'image' => 'small-square.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['dealing'],
		'properties' => ['dealing' => ['energy' => 20, 'minPrice' => 1, 'maxPrice' => 2, 'minClients' => 5, 'maxClients' => 10, 'duration' => 600, 'burnChance' => 0]],
		'requires' => ['during:money-on-streets']
	],
	[
		'name' => 'tutorial-bus-stop',
		'image' => 'bus-stop.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['travel'],
		'properties' => ['travel' => ['cost' => 1, 'speed' => 60, 'available' => 'tutorial']],
		'requires' => ['during:trip']
	],
	[
		'name' => 'bobbys-house',
		'image' => 'wooden_house.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['shop', 'npc'],
		'properties' => ['shop' => ['requires' => 'during:from-seeds', 'name' => 'tutorial-growshop', 'delivery' => 3600, 'items' => 2], 'npc' => ['name' => 'bobby']],
		'requires' => ['during:where-is-bobby']
	],
	[
		'name' => 'tutorial-plantation',
		'image' => 'plantation.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['plantation'],
		'properties' => ['plantation' => ['light' => 1, 'ground' => 1, 'slots' => 5]],
		'requires' => ['during:el-greenado']
	],
	[
		'name' => 'tutorial-train-station',
		'image' => 'train-station.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => [],
		'properties' => [],
		'requires' => ['during:great-escape']
	],
	[
		'name' => 'tutorial-shop',
		'image' => 'convenience-store.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'tutorial-shop', 'delivery' => 3600, 'items' => 2]],
		'requires' => ['during:more-water']
	],
	[
		'name' => 'tutorial-arrest',
		'image' => 'arrest.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['arrest'],
		'properties' => ['arrest' => ['duration' => 120]],
		'requires' => ['blocked:']
	],
	[
		'name' => 'tutorial-clinic',
		'image' => 'clinic.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['hospital'],
		'properties' => ['hospital' => ['normalSpeed' => 10, 'normalPrice' => 1, 'normalAvailable' => 0, 'fastAvailable' => 0]],
		'requires' => ['blocked:']
	],
];
?>
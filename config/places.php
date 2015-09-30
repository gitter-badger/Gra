<?php

return [
	[
		'name' => 'tutorial-apartment',
		'image' => 'apartment.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['npc'],
		'properties' => ['npc' => ['name' => 'tutorial-dude']],
		'requires' => []
	],
	[
		'name' => 'tutorial-bulletin-board',
		'image' => 'bulletin-board.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['work'],
		'properties' => ['work' => ['groups' => 'tutorial', 'reset' => 600, 'atOnce' => 2, 'perGroup' => 2]],
		'requires' => ['during:work-hard']
	],
	[
		'name' => 'tutorial-square',
		'image' => 'small-square.jpg',
		'visible' => false,
		'dangerous' => false,
		'components' => ['dealing'],
		'properties' => ['dealing' => ['energy' => 20, 'minPrice' => 1, 'maxPrice' => 2, 'minClients' => 5, 'maxClients' => 10, 'duration' => 600, 'burnChance' => 0]],
		'requires' => ['during:lets-start']
	],
];
?>
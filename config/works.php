<?php

return [
	'bulletin-board' => [
		'distributing-leaflets' => [
			'duration' => 600,
			'costs' => ['energy:10'],
			'rewards' => ['money:10', 'experience:10'],
			'requires' => []
		],
		'washing-panes' => [
			'duration' => 600,
			'costs' => ['energy:10'],
			'rewards' => ['money:10', 'experience:10'],
			'requires' => []
		],
		'outputting-a-dog' => [
			'duration' => 600,
			'costs' => ['energy:10'],
			'rewards' => ['money:10', 'experience:10'],
			'requires' => []
		],
		'work-in-the-warehouse' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:20', 'experience:20'],
			'requires' => ['strength:10', 'endurance: 15']
		],
		'laying-panels' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:20', 'experience:20'],
			'requires' => ['strength:5']
		],
		'private-lessons-from-history' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:20', 'experience:20'],
			'requires' => ['intelligence:10', 'charisma:5']
		],
		'bringing-furniture' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:20', 'experience:20'],
			'requires' => ['strength:15', 'endurance:10']
		],
		'computer-repair' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:20', 'experience:20'],
			'requires' => ['intelligence:20', 'agility:5']
		],
		'tv-repair' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:20', 'experience:20'],
			'requires' => ['intelligence:10']
		],
		'baby-nurse' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:20', 'experience:20'],
			'requires' => ['charisma:15']
		],
		'unloading-a-truck' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:20', 'experience:20'],
			'requires' => ['strength:10', 'endurance:10']
		],
		'covering-the-goods' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:20', 'experience:20'],
			'requires' => []
		],
	],
	'dump' => [
		'collecting-scrap-metal' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:10', 'experience:15'],
			'requires' => null
		],
		'collection-of-waste-paper' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:10', 'experience:15'],
			'requires' => null
		],
		'collecting-bottles' => [
			'duration' => 1800,
			'costs' => ['energy:20'],
			'rewards' => ['money:10', 'experience:15'],
			'requires' => null
		],
	],
	'tutorial-works' => [
		'tutorial-distributing-leaflets' => [
			'duration' => 600,
			'costs' => ['energy:10'],
			'rewards' => ['money:20,0', 'experience:5,0'],
			'requires' => []
		],
	],
];
?>
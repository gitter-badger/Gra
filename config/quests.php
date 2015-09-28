<?php

return [
	'tutorial-work' => [
		'breakable' => 0,
		'repeatable' => 0,
		'auto' => 1,
		'daily' => 0,
		'rewards' => ['start:tutorial-seed'],
		'objectives' => ['visit:tutorial-bulletin-board', 'work:1'],
		'requires' => []
	],
	'tutorial-seed' => [
		'breakable' => 0,
		'repeatable' => 0,
		'auto' => 1,
		'daily' => 0,
		'rewards' => ['start:tutorial-plant'],
		'objectives' => ['visit:small-growshop', 'buy:1,seed'],
		'requires' => ['quest:tutorial-work']
	],
	'tutorial-plant' => [
		'breakable' => 0,
		'repeatable' => 0,
		'auto' => 1,
		'daily' => 0,
		'rewards' => ['start:tutorial-watering'],
		'objectives' => ['visit:small-plantation', 'plant:1'],
		'requires' => ['quest:tutorial-plant']
	],
	'tutorial-watering' => [
		'breakable' => 0,
		'repeatable' => 0,
		'auto' => 1,
		'daily' => 0,
		'rewards' => ['start:tutorial-harvest'],
		'objectives' => ['visit:small-plantation', 'watering:1'],
		'requires' => ['quest:tutorial-plant']
	],
	'tutorial-harvest' => [
		'breakable' => 0,
		'repeatable' => 0,
		'auto' => 1,
		'daily' => 0,
		'rewards' => ['start:tutorial-dealing'],
		'objectives' => ['visit:small-plantation', 'harvestPlant:1'],
		'requires' => ['quest:tutorial-watering']
	],
];
?>
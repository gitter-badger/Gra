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
		'objectives' => ['visit:tutorial-growshop', 'buy:1,seed'],
		'requires' => ['quest:tutorial-work']
	],
	'tutorial-plant' => [
		'breakable' => 0,
		'repeatable' => 0,
		'auto' => 1,
		'daily' => 0,
		'rewards' => ['start:tutorial-watering'],
		'objectives' => ['visit:tutorial-plantation', 'plant:1'],
		'requires' => ['quest:tutorial-plant']
	],
	'tutorial-watering' => [
		'breakable' => 0,
		'repeatable' => 0,
		'auto' => 1,
		'daily' => 0,
		'rewards' => ['start:tutorial-harvest'],
		'objectives' => ['watering:1'],
		'requires' => ['quest:tutorial-plant']
	],
	'tutorial-harvest' => [
		'breakable' => 0,
		'repeatable' => 0,
		'auto' => 1,
		'daily' => 0,
		'rewards' => ['start:tutorial-dealing'],
		'objectives' => ['harvestPlant:1'],
		'requires' => ['quest:tutorial-watering']
	],
	'tutorial-dealing' => [
		'breakable' => 0,
		'repeatable' => 0,
		'auto' => 1,
		'daily' => 0,
		'rewards' => [],
		'objectives' => ['visit:tutorial-square', 'dealCount:1'],
		'requires' => ['quest:tutorial-harvest']
	],
];
?>
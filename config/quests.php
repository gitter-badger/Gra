<?php

return [
	'first-work' => [
		'breakable' => false,
		'repeatable' => false,
		'auto' => true,
		'rewards' => ['start:first-seed'],
		'objectives' => ['work:1'],
		'requires' => []
	],
	'first-seed' => [
		'breakable' => false,
		'repeatable' => false,
		'auto' => true,
		'rewards' => ['start:first-plant'],
		'objectives' => ['buy:1,seed'],
		'requires' => []
	],
	'first-plant' => [
		'breakable' => false,
		'repeatable' => false,
		'auto' => true,
		'rewards' => ['start:first-deal'],
		'objectives' => ['harvestPlant:1'],
		'requires' => []
	],
	'first-deal' => [
		'breakable' => false,
		'repeatable' => false,
		'auto' => true,
		'rewards' => ['start:first-travel'],
		'objectives' => ['dealCount:1'],
		'requires' => []
	],
	'first-travel' => [
		'breakable' => false,
		'repeatable' => false,
		'auto' => true,
		'rewards' => ['money:500,0'],
		'objectives' => ['travelTo:capital'],
		'requires' => []
	],
	'work' => [
		'breakable' => true,
		'repeatable' => true,
		'auto' => false,
		'rewards' => ['experience:250'],
		'objectives' => ['work:10'],
		'requires' => []
	],
	'harvest' => [
		'breakable' => true,
		'repeatable' => true,
		'auto' => false,
		'rewards' => ['experience:500'],
		'objectives' => ['harvestStuff:1000'],
		'requires' => ['plantator:10']
	],
	'deal' => [
		'breakable' => true,
		'repeatable' => true,
		'auto' => false,
		'rewards' => ['experience:500'],
		'objectives' => ['dealCount:1000'],
		'requires' => ['dealer:10']
	],


	'daily-work' => [
		'breakable' => true,
		'repeatable' => true,
		'auto' => false,
		'rewards' => ['experience:250'],
		'objectives' => ['work:3'],
		'requires' => []
	],

	'daily-harvest' => [
		'breakable' => true,
		'repeatable' => true,
		'auto' => false,
		'rewards' => ['experience:500'],
		'objectives' => ['harvestPlant:3'],
		'requires' => []
	],

	'daily-deal' => [
		'breakable' => true,
		'repeatable' => true,
		'auto' => false,
		'rewards' => ['experience:500'],
		'objectives' => ['dealCount:10'],
		'requires' => []
	],

	'dailyTravel' => [
		'breakable' => true,
		'repeatable' => true,
		'auto' => false,
		'rewards' => ['experience:500'],
		'objectives' => ['travelDistance:100'],
		'requires' => []
	],
];
?>
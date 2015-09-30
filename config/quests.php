<?php

return [
	'work-hard' => [
		'breakable' => 0,
		'repeatable' => 0,
		'auto' => 0,
		'daily' => 0,
		'rewards' => ['experience:5'],
		'objectives' => ['money:20'],
		'accept' => null,
		'requires' => []
	],
	'lets-start' => [
		'breakable' => 0,
		'repeatable' => 0,
		'auto' => 0,
		'daily' => 0,
		'rewards' => [],
		'objectives' => ['dealCount:20'],
		'accept' => ['stuff:auto-dwarf-stuff,20,5'],
		'requires' => ['quest:work-hard']
	],
];
?>
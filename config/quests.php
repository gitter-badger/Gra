<?php

return [
	'tutorial' => [
		'first-work' => [
			'rewards' => ['start:first-seed'],
			'requires' => []
		],
		'first-seed' => [
			'rewards' => ['start:first-plant'],
			'requires' => []
		],
		'first-plant' => [
			'rewards' => ['start:first-deal'],
			'requires' => []
		],
		'first-deal' => [
			'rewards' => ['start:first-travel'],
			'requires' => []
		],
		'first-travel' => [
			'rewards' => ['money:500,0'],
			'requires' => []
		],
	],
];
?>
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
			'rewards' => [],
			'requires' => []
		],
	],
];
?>
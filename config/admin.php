<?php


return [

	'components' => [

		'shop' => [

			'name',
		],

		'store' => [

			'allow',
			'deny',
		],

		'travel' => [

			'cost',
			'speed',
			'available',
		],

		'rent' => [

			'cost',
			'duration',
		],

		'work' => [

			'groups',
			'reset',
			'atOnce',
			'perGroup',
		],

		'plantation' => [

			'light',
			'ground',
			'slots',
		],

		'dealing' => [

			'durationMin',
			'durationMax',
			'energy',
			'minInterval',
			'maxInterval',
			'minStuff',
			'maxStuff',
		],

		'market' => [

			'minPrice',
			'maxPrice',
			'allow',
			'deny',
		],
	],

	'requirements' => [

		'level' => [

			'level'
		],
	],

];
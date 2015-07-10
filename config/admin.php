<?php


return [

	'components' => [

		'arrest' => [

			'duration',
		],

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

		'vehicleTravel' => [

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
			'burnChance',
		],

		'market' => [

			'minPrice',
			'maxPrice',
			'allow',
			'deny',
		],
	],
];
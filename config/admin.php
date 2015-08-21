<?php


return [

	'components' => [

		'arrest' => [

			'duration',
		],

		'shop' => [

			'name',
			'delivery',
			'items',
			'resetable',
			'resetCost',
			'resetCooldown',
		],

		'store' => [

			'allow',
			'deny',
			'baseCapacity',
			'capacityPerLevel',
			'capacityPerPremiumLevel',
			'levelPrice',
			'premiumLevelPrice',
			'levelBasePrice',
			'premiumLevelBasePrice',
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

		'investment' => [

			'name',
			'price',
			'worksNeeded',
			'groups',
		],

		'work' => [

			'groups',
			'reset',
			'atOnce',
			'perGroup',
			'resetable',
			'resetCost',
			'resetCooldown',
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
			'minPrice',
			'maxPrice',
			'minInterval',
			'maxInterval',
			'minStuff',
			'maxStuff',
			'beatChance',
			'burnChance',
		],

		'market' => [

			'minPrice',
			'maxPrice',
			'allow',
			'deny',
		],

		'gambling' => [

			'minBet',
			'maxBet',
			'exchange',
			'duration',
		],

		'bank' => [

		],

		'church' => [

			'price',
			'bonus',
			'duration',
		],

		'hospital' => [

			'normalSpeed',
			'normalPrice',
			'fastSpeed',
			'fastPrice',
		],

		'attack' => [

			'minLevel',
			'threshold',
		],

		'gang' => [

			
		],

		'gang-bank' => [

		],

		'gang-store' => [

			'allow',
			'deny',
			'baseCapacity',
			'capacityPerLevel',
			'capacityPerPremiumLevel',
			'levelPrice',
			'premiumLevelPrice',
			'levelBasePrice',
			'premiumLevelBasePrice',
		],

		'transport' => [

			
		],

		'npc' => [

			'name',
		],
	],
];
<?php

return [

	'plantator' => [


		'watering-energy' => [

			'image' => 'watering.png',
			'requires' => [

				'plantator:10'
			],
		],

		'planting-energy' => [

			'image' => 'planting.png',
			'requires' => [

				'plantator:20',
			],
		],

		'harvesting-energy' => [

			'image' => 'harvesting.png',
			'requires' => [

				'plantator:20',
			],
		],

		'planting-fast' => [

			'image' => 'planting.png',
			'requires' => [

				'plantator:50',
			],
		],

		'harvesting-fast' => [

			'image' => 'watering.png',
			'requires' => [

				'plantator:50',
			],
		],

		'watering-better' => [

			'image' => 'watering.png',
			'requires' => [

				'plantator:75',
			],
		],

		'planting-better' => [

			'image' => 'planting.png',
			'requires' => [

				'plantator:100',
			],
		],

		'harvesting-better' => [

			'image' => 'harvesting.png',
			'requires' => [

				'plantator:100',
			],
		],
	],

	'smuggler' => [

		'travel-bike' => [

			'image' => '',
			'requires' => [

				'smuggler:10',
			],
		],

		'travel-car' => [

			'image' => '',
			'requires' => [

				'smuggler:20',
			],
		],

		'travel-economic' => [

			'image' => '',
			'requires' => [

				'smuggler:30',
			],
		],

		'travel-capacity' => [

			'image' => '',
			'requires' => [

				'smuggler:30',
			],
		],

		'travel-fast' => [

			'image' => '',
			'requires' => [

				'smuggler:30',
			],
		],


	],

	'dealer' => [


	],
];
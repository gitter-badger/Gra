<?php

return [

	'plantator' => [

		'plantator-points' => [

			'image' => '',
			'requires' => [

				'plantator:10',
			],
		],

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

		'smuggler-points' => [

			'image' => '',
			'requires' => [

				'smuggler:10',
			],
		],

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


		'dealer-points' => [

			'image' => '',
			'requires' => [

				'dealer:10',
			],
		],

		'dealer-energy' => [

			'image' => '',
			'requires' => [

				'dealer:10',
			],
		],
	],


	'general' => [

		'work-points' => [

			'image' => '',
			'requires' => [

				'level:10',
			],
		],



		'more-energy-1' => [

			'image' => 'energy.png',
			'requires' => [

				'level:20',
				'notalent:more-health-1'
			],
		],

		'more-health-1' => [

			'image' => 'health.png',
			'requires' => [

				'level:20',
				'notalent:more-energy-1',
			],
		],


		'more-energy-2' => [

			'image' => 'energy.png',
			'requires' => [

				'level:40',
				'notalent:more-health-2'
			],
		],

		'more-health-2' => [

			'image' => 'health.png',
			'requires' => [

				'level:40',
				'notalent:more-energy-2',
			],
		],


		'more-energy-3' => [

			'image' => 'energy.png',
			'requires' => [

				'level:60',
				'notalent:more-health-3'
			],
		],

		'more-health-3' => [

			'image' => 'health.png',
			'requires' => [

				'level:60',
				'notalent:more-energy-3',
			],
		],


		'more-energy-4' => [

			'image' => 'energy.png',
			'requires' => [

				'level:80',
				'notalent:more-health-4'
			],
		],

		'more-health-4' => [

			'image' => 'health.png',
			'requires' => [

				'level:80',
				'notalent:more-energy-4',
			],
		],


		'more-energy-5' => [

			'image' => 'energy.png',
			'requires' => [

				'level:100',
				'notalent:more-health-5'
			],
		],

		'more-health-5' => [

			'image' => 'health.png',
			'requires' => [

				'level:100',
				'notalent:more-energy-5',
			],
		],
	],
];
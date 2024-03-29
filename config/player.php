<?php

return [

	'start' => [

		'stats' => 25,
		'location' => 'tutorial-city',
		'money' => 0,
		'luck' => 50,
	],

	'luck' => [

		'min' => 10,
		'max' => 90,
		'change' => 5,
		'update' => 10 * 60,
	],

	'energy' => [

		'restore' => [

			'premium' => 45,
			'normal' => 60,
		],
	],

	'wanted' => [

		'update' => 2 * 3600,
	],

	'levelup' => [

		'statisticsPoints' => 3,
		'levelsPerTalent' => 10,
	],

	'planting' => [

		'energy' => 25,
		'duration' => 10 * 60,
	],

	'harvesting' => [

		'energy' => 25,
		'duration' => 10 * 60,
	],

	'attacking' => [

		'energy' => 25,
		'duration' => 10 * 60,
	],

	'capacity' => [

		'base' => 100,
		'perLevel' => 1,
		'perStrength' => 3,
		'perEndurance' => 2,
	],

	'avatars' => [



		'male' => [

			'a1.png',
			'a2.png',
			'a3.png',
			'a4.png',
			'a5.png',
			'a6.png',
			'a7.png',
			'a9.png',
			'a12.png',
			'a13.png',
		],

		'famale' => [

			'a8.png',
			'a10.png',
			'a11.png',
		],
	],

	'plantator' => [

		'expPerStuff' => 0.05,
	],

	'reference' => [

		'interval' => 24 * 3600,
		'money' => 100,
	],

	'modifier' => [

		'experience' => 1,
		'money' => 1,
	],

	'premium' => [

		'dailyPoints' => 5,
		'chance' => 10,
	],

	'daily' => [

		'quests' => 3,
		'reset' => 7,

		'rewards' => [

			1 => ['money:100'],
			7 => ['money:100', 'experience:100'],
		],
		
	],
];

?>
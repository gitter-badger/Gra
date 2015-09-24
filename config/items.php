<?php

return [
	'weapons' => [
		[
			'name' => 'foam-sword',
			'image' => 'foam-sword.jpg',
			'price' => 50,
			'weight' => 2,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:1',
				],
			],
			'damage' => [1, 2],
			'critChance' => 0.01,
			'speed' => +0,
			'type' => 'melee',
		],
		[
			'name' => 'water-gun',
			'image' => 'water-gun.jpg',
			'price' => 70,
			'weight' => 2,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'perception:1',
				],
			],
			'damage' => [2, 3],
			'critChance' => 0.01,
			'speed' => +0,
			'type' => 'ranged',
		],
		[
			'name' => 'stick',
			'image' => 'stick.jpg',
			'price' => 40,
			'weight' => 2,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:3',
				],
			],
			'damage' => [3, 4],
			'critChance' => 0.01,
			'speed' => +0,
			'type' => 'melee',
		],
		[
			'name' => 'pop-gun',
			'image' => 'pop-gun.jpg',
			'price' => 100,
			'weight' => 2,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'perception:3',
				],
			],
			'damage' => [4, 5],
			'critChance' => 0.01,
			'speed' => +0.05,
			'type' => 'ranged',
		],
		[
			'name' => 'staff',
			'image' => 'staff.jpg',
			'price' => 160,
			'weight' => 5,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:5',
				],
			],
			'damage' => [5, 6],
			'critChance' => 0.02,
			'speed' => +0,
			'type' => 'melee',
		],
		[
			'name' => 'penknife',
			'image' => 'penknife.jpg',
			'price' => 200,
			'weight' => 3,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:2',
					'agility:4',
				],
			],
			'damage' => [6, 7],
			'critChance' => 0.05,
			'speed' => +0.1,
			'type' => 'melee',
		],
		[
			'name' => 'pepper-spray',
			'image' => 'pepper-spray.jpg',
			'price' => 350,
			'weight' => 2,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'perception:4',
				],
			],
			'damage' => [7, 8],
			'critChance' => 0.06,
			'speed' => +0.05,
			'type' => 'ranged',
		],
		[
			'name' => 'baseball-bat',
			'image' => 'baseball-bat.jpg',
			'price' => 300,
			'weight' => 5,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:8',
					'endurance:4',
				],
			],
			'damage' => [8, 9],
			'critChance' => 0.08,
			'speed' => +0,
			'type' => 'melee',
		],
		[
			'name' => 'dagger',
			'image' => 'dagger.jpg',
			'price' => 500,
			'weight' => 3,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:5',
					'agility:10',
				],
			],
			'damage' => [9, 10],
			'critChance' => 0.15,
			'speed' => +0.1,
			'type' => 'melee',
		],
		[
			'name' => 'flintlock',
			'image' => 'flintlock.jpg',
			'price' => 720,
			'weight' => 4,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:4',
					'perception:7',
				],
			],
			'damage' => [10, 11],
			'critChance' => 0.02,
			'speed' => -0.05,
			'type' => 'ranged',
		],
		[
			'name' => 'hunting-knife',
			'image' => 'hunting-knife.jpg',
			'price' => 924,
			'weight' => 3,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:3',
					'agility:10',
				],
			],
			'damage' => [11, 12],
			'critChance' => 0.01,
			'speed' => +0.2,
			'type' => 'melee',
		],
		[
			'name' => 'shuriken',
			'image' => 'shuriken.jpg',
			'price' => 1220,
			'weight' => 3,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'perception:10',
					'agility:7',
				],
			],
			'damage' => [12, 13],
			'critChance' => 0.15,
			'speed' => +0.05,
			'type' => 'ranged',
		],
		[
			'name' => 'battle-staff',
			'image' => 'battle-staff.jpg',
			'price' => 1659,
			'weight' => 6,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:12',
					'endurance:4',
				],
			],
			'damage' => [13, 16],
			'critChance' => 0.06,
			'speed' => +0,
			'type' => 'melee',
		],
		[
			'name' => 'tomahawk',
			'image' => 'tomahawk.jpg',
			'price' => 2439,
			'weight' => 4,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:3',
					'perception:13',
					'agility:8',
				],
			],
			'damage' => [14, 18],
			'critChance' => 0.09,
			'speed' => +0.05,
			'type' => 'ranged',
		],
		[
			'name' => 'hatchet',
			'image' => 'hatchet.jpg',
			'price' => 3171,
			'weight' => 9,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:15',
					'endurance:6',
				],
			],
			'damage' => [15, 20],
			'critChance' => 0.18,
			'speed' => -0.05,
			'type' => 'melee',
		],
		[
			'name' => 'machete',
			'image' => 'machete.jpg',
			'price' => 4281,
			'weight' => 8,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:20',
					'agility:8',
				],
			],
			'damage' => [16, 21],
			'critChance' => 0.18,
			'speed' => +0,
			'type' => 'melee',
		],
		[
			'name' => 'musket',
			'image' => 'musket.jpg',
			'price' => 6293,
			'weight' => 7,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:8',
					'perception:17',
				],
			],
			'damage' => [17, 22],
			'critChance' => 0.08,
			'speed' => -0.1,
			'type' => 'ranged',
		],
		[
			'name' => 'taser',
			'image' => 'taser.jpg',
			'price' => 8495,
			'weight' => 3,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:6',
					'agility:6',
					'intelligence:12',
				],
			],
			'damage' => [18, 27],
			'critChance' => 0.09,
			'speed' => +0,
			'type' => 'ranged',
		],
		[
			'name' => 'assault-knife',
			'image' => 'assault-knife.jpg',
			'price' => 11468,
			'weight' => 4,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:8',
					'agility:20',
				],
			],
			'damage' => [19, 32],
			'critChance' => 0.06,
			'speed' => +0.15,
			'type' => 'melee',
		],
		[
			'name' => 'pistol',
			'image' => 'pistol.jpg',
			'price' => 15253,
			'weight' => 6,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:4',
					'perception:20',
					'agility:6',
				],
			],
			'damage' => [22, 35],
			'critChance' => 0.15,
			'speed' => +0.1,
			'type' => 'ranged',
		],
		[
			'name' => 'axe',
			'image' => 'axe.jpg',
			'price' => 19828,
			'weight' => 15,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:25',
					'endurance:10',
				],
			],
			'damage' => [25, 40],
			'critChance' => 0.2,
			'speed' => -0.1,
			'type' => 'melee',
		],
		[
			'name' => 'pistol-silencer',
			'image' => 'pistol-silencer.jpg',
			'price' => 25975,
			'weight' => 8,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:5',
					'perception:25',
					'agility:15',
				],
			],
			'damage' => [29, 45],
			'critChance' => 0.12,
			'speed' => +0.1,
			'type' => 'ranged',
		],
		[
			'name' => 'revolver',
			'image' => 'revolver.jpg',
			'price' => 38184,
			'weight' => 7,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:10',
					'perception:30',
					'agility:15',
				],
			],
			'damage' => [32, 50],
			'critChance' => 0.15,
			'speed' => +0.5,
			'type' => 'ranged',
		],
		[
			'name' => 'battle-gun',
			'image' => 'battle-gun.jpg',
			'price' => 51548,
			'weight' => 10,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:15',
					'perception:30',
					'agility:15',
				],
			],
			'damage' => [37, 55],
			'critChance' => 0.06,
			'speed' => -0.15,
			'type' => 'ranged',
		],
		[
			'name' => 'anti-gun',
			'image' => 'anti-gun.jpg',
			'price' => 67012,
			'weight' => 13,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:25',
					'perception:30',
					'agility:15',
				],
			],
			'damage' => [42, 60],
			'critChance' => 0.13,
			'speed' => -0.15,
			'type' => 'ranged',
		],
		[
			'name' => 'uzi',
			'image' => 'uzi.jpg',
			'price' => 89796,
			'weight' => 7,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:17',
					'perception:35',
					'agility:25',
				],
			],
			'damage' => [47, 65],
			'critChance' => 0.15,
			'speed' => +0,
			'type' => 'ranged',
		],
		[
			'name' => 'saber',
			'image' => 'saber.jpg',
			'price' => 119429,
			'weight' => 8,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:30',
					'agility:25',
					'endurance:10',
				],
			],
			'damage' => [52, 70],
			'critChance' => 0.1,
			'speed' => +0.15,
			'type' => 'melee',
		],
		[
			'name' => 'piston-rifle',
			'image' => 'piston-rifle.jpg',
			'price' => 162424,
			'weight' => 10,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:35',
					'perception:30',
					'endurance:20',
				],
			],
			'damage' => [54, 75],
			'critChance' => 0.19,
			'speed' => +0,
			'type' => 'ranged',
		],
		[
			'name' => 'heavy-rifle',
			'image' => 'heavy-rifle.jpg',
			'price' => 217648,
			'weight' => 20,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:40',
					'perception:35',
					'endurance:25',
				],
			],
			'damage' => [59, 80],
			'critChance' => 0.04,
			'speed' => -0.2,
			'type' => 'ranged',
		],
		[
			'name' => 'rifle',
			'image' => 'rifle.jpg',
			'price' => 282942,
			'weight' => 15,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:30',
					'perception:50',
					'agility:25',
				],
			],
			'damage' => [64, 85],
			'critChance' => 0.11,
			'speed' => +0.1,
			'type' => 'ranged',
		],
		[
			'name' => 'katana',
			'image' => 'katana.jpg',
			'price' => 381972,
			'weight' => 10,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:25',
					'agility:50',
				],
			],
			'damage' => [69, 90],
			'critChance' => 0.11,
			'speed' => +0.25,
			'type' => 'melee',
		],
		[
			'name' => 'sawed',
			'image' => 'sawed.jpg',
			'price' => 504203,
			'weight' => 18,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:40',
					'perception:40',
					'endurance:20',
				],
			],
			'damage' => [74, 95],
			'critChance' => 0.16,
			'speed' => -0.25,
			'type' => 'ranged',
		],
		[
			'name' => 'assault-smg',
			'image' => 'assault-smg.jpg',
			'price' => 660506,
			'weight' => 13,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:35',
					'perception:50',
					'agility:30',
				],
			],
			'damage' => [79, 100],
			'critChance' => 0.05,
			'speed' => +0,
			'type' => 'ranged',
		],
		[
			'name' => 'assault-rifle',
			'image' => 'assault-rifle.jpg',
			'price' => 858658,
			'weight' => 15,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:35',
					'perception:50',
					'agility:45',
				],
			],
			'damage' => [84, 105],
			'critChance' => 0.08,
			'speed' => +0,
			'type' => 'ranged',
		],
		[
			'name' => 'flamethrower',
			'image' => 'flamethrower.jpg',
			'price' => 1142016,
			'weight' => 25,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:50',
					'endurance:40',
					'intelligence:40',
				],
			],
			'damage' => [89, 110],
			'critChance' => 0.18,
			'speed' => -0.15,
			'type' => 'ranged',
		],
		[
			'name' => 'machine-gun',
			'image' => 'machine-gun.jpg',
			'price' => 1530301,
			'weight' => 20,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:75',
					'perception:50',
				],
			],
			'damage' => [94, 115],
			'critChance' => 0.13,
			'speed' => +0.05,
			'type' => 'ranged',
		],
		[
			'name' => 'sniper-rifle',
			'image' => 'sniper-rifle.jpg',
			'price' => 2035300,
			'weight' => 17,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:60',
					'perception:90',
					'agility:75',
				],
			],
			'damage' => [99, 120],
			'critChance' => 0.2,
			'speed' => -0.6,
			'type' => 'ranged',
		],
		[
			'name' => 'howitzer',
			'image' => 'howitzer.jpg',
			'price' => 2645890,
			'weight' => 10,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:80',
					'endurance:60',
				],
			],
			'damage' => [104, 125],
			'critChance' => 0.12,
			'speed' => +0,
			'type' => 'ranged',
		],
		[
			'name' => 'rocket-launcher',
			'image' => 'rocket-launcher.jpg',
			'price' => 3571952,
			'weight' => 35,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:70',
					'endurance:50',
					'intelligence:65',
				],
			],
			'damage' => [109, 130],
			'critChance' => 0.12,
			'speed' => -0.75,
			'type' => 'ranged',
		],
		[
			'name' => 'minigun',
			'image' => 'minigun.jpg',
			'price' => 4822135,
			'weight' => 25,
			'premium' => 0,
			'properties' => [
				'requires' => [

					'strength:60',
					'perception:100',
					'endurance:50',
				],
			],
			'damage' => [114, 135],
			'critChance' => 0.07,
			'speed' => +0.1,
			'type' => 'ranged',
		],
	],
];



?>
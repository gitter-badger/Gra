<?php

return [
	'weapons' => [
		['name' => 'stick', 'image' => 'stick.jpg', 'price' => 0, 'weight' => 5, 'premium' => 0, 'properties' => ['requires' => ['level:1']], 'damage' => [1, 3], 'critChance' => 0.01, 'speed' => -0.05, 'type' => 'melee'],
		['name' => 'foam-sword', 'image' => 'foam-sword.jpg', 'price' => 15, 'weight' => 2, 'premium' => 0, 'properties' => ['requires' => ['level:1']], 'damage' => [3, 6], 'critChance' => 0.02, 'speed' => -0.01, 'type' => 'melee'],
		['name' => 'staff', 'image' => 'staff.jpg', 'price' => 25, 'weight' => 8, 'premium' => 0, 'properties' => ['requires' => ['level:1']], 'damage' => [4, 8], 'critChance' => 0.02, 'speed' => -0.07, 'type' => 'melee'],
		['name' => 'water-gun', 'image' => 'water-gun.jpg', 'price' => 25, 'weight' => 4, 'premium' => 0, 'properties' => ['requires' => ['level:1']], 'damage' => [3, 8], 'critChance' => 0.01, 'speed' => +0.05, 'type' => 'ranged'],
		['name' => 'knife', 'image' => 'knife.jpg', 'price' => 50, 'weight' => 5, 'premium' => 0, 'properties' => ['requires' => ['level:1']], 'damage' => [7, 14], 'critChance' => 0.05, 'speed' => +0, 'type' => 'melee'],
		['name' => 'paralizator', 'image' => 'paralizator.jpg', 'price' => 500, 'weight' => 6, 'premium' => 0, 'properties' => ['requires' => ['level:1']], 'damage' => [11, 20], 'critChance' => 0.1, 'speed' => +0, 'type' => 'melee'],
		['name' => 'baseball-bat', 'image' => 'baseball-bat.jpg', 'price' => 200, 'weight' => 15, 'premium' => 0, 'properties' => ['requires' => ['level:5']], 'damage' => [13, 23], 'critChance' => 0.03, 'speed' => -0.09, 'type' => 'melee'],
		['name' => 'peper-spray', 'image' => 'peper-spray.jpg', 'price' => 150, 'weight' => 8, 'premium' => 0, 'properties' => ['requires' => ['level:5']], 'damage' => [7, 14], 'critChance' => 0.03, 'speed' => +0, 'type' => 'ranged'],
		['name' => 'knuckle-duster', 'image' => 'knuckle-duster.jpg', 'price' => 75, 'weight' => 5, 'premium' => 0, 'properties' => ['requires' => ['level:5']], 'damage' => [5, 11], 'critChance' => 0.02, 'speed' => +0, 'type' => 'melee'],
		['name' => 'machete', 'image' => 'machete.jpg', 'price' => 250, 'weight' => 25, 'premium' => 0, 'properties' => ['requires' => ['level:5']], 'damage' => [17, 27], 'critChance' => 0.07, 'speed' => +0.02, 'type' => 'melee'],
		['name' => 'sword', 'image' => 'sword.jpg', 'price' => 750, 'weight' => 35, 'premium' => 0, 'properties' => ['requires' => ['level:10']], 'damage' => [20, 30], 'critChance' => 0.1, 'speed' => +0.04, 'type' => 'melee'],
		['name' => 'colt-1911', 'image' => 'colt-1911.jpg', 'price' => 1500, 'weight' => 35, 'premium' => 0, 'properties' => ['requires' => ['level:10']], 'damage' => [27, 38], 'critChance' => 0.1, 'speed' => +0.06, 'type' => 'ranged'],
		['name' => 'glock', 'image' => 'glock.jpg', 'price' => 1500, 'weight' => 35, 'premium' => 0, 'properties' => ['requires' => ['level:10']], 'damage' => [27, 38], 'critChance' => 0.1, 'speed' => +0.06, 'type' => 'ranged'],
		['name' => 'ak-47', 'image' => 'ak-47.jpg', 'price' => 1500, 'weight' => 35, 'premium' => 0, 'properties' => ['requires' => ['level:25']], 'damage' => [27, 38], 'critChance' => 0.1, 'speed' => +0.06, 'type' => 'ranged'],
		['name' => 'm4a1', 'image' => 'm4a1.jpg', 'price' => 1500, 'weight' => 35, 'premium' => 0, 'properties' => ['requires' => ['level:25']], 'damage' => [27, 38], 'critChance' => 0.1, 'speed' => +0.06, 'type' => 'ranged'],
		['name' => 'flare', 'image' => 'flare.jpg', 'price' => 1500, 'weight' => 35, 'premium' => 0, 'properties' => ['requires' => ['level:25']], 'damage' => [27, 38], 'critChance' => 0.1, 'speed' => +0.06, 'type' => 'ranged'],
		['name' => 'bazooka', 'image' => 'bazooka.jpg', 'price' => 1500, 'weight' => 35, 'premium' => 0, 'properties' => ['requires' => ['level:25']], 'damage' => [27, 38], 'critChance' => 0.1, 'speed' => +0.06, 'type' => 'ranged'],
	],
	'armors' => [
		['name' => 't-shirt', 'image' => 't-shirt.jpg', 'price' => 25, 'weight' => 2, 'premium' => 0, 'properties' => ['requires' => ['level:1']], 'armor' => 1, 'speed' => +0],
		['name' => 'pan-colander', 'image' => 'pan-colander.jpg', 'price' => 50, 'weight' => 8, 'premium' => 0, 'properties' => ['requires' => ['level:5']], 'armor' => 2, 'speed' => -0.2],
		['name' => 'sumo-costume', 'image' => 'sumo-costume.jpg', 'price' => 30, 'weight' => 6, 'premium' => 0, 'properties' => ['requires' => ['level:5']], 'armor' => 3, 'speed' => -0.5],
		['name' => 'squire-armor', 'image' => 'squire-armor.jpg', 'price' => 100, 'weight' => 9, 'premium' => 0, 'properties' => ['requires' => ['level:10']], 'armor' => 4, 'speed' => -0.6],
		['name' => 'bulletprof-vest', 'image' => 'bulletprof-vest.jpg', 'price' => 500, 'weight' => 13, 'premium' => 0, 'properties' => ['requires' => ['level:10']], 'armor' => 5, 'speed' => -0.6],
		['name' => 'knight-armor', 'image' => 'knight-armor.jpg', 'price' => 1000, 'weight' => 25, 'premium' => 0, 'properties' => ['requires' => ['level:25']], 'armor' => 6, 'speed' => -0.8],
		['name' => 'kevlar', 'image' => 'kevlar.jpg', 'price' => 2000, 'weight' => 15, 'premium' => 0, 'properties' => ['requires' => ['level:25']], 'armor' => 7, 'speed' => -0.5],
		['name' => 'samurai-armor', 'image' => 'samurai-armor.jpg', 'price' => 5000, 'weight' => 35, 'premium' => 0, 'properties' => ['requires' => ['level:25']], 'armor' => 8, 'speed' => -0.4],
	],
	'foods' => [
		['name' => 'loaf', 'image' => 'loaf.jpg', 'price' => 5, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => []], 'health' => 1, 'energy' => null],
		['name' => 'doughnut', 'image' => 'doughnut.jpg', 'price' => 10, 'weight' => 2, 'premium' => 0, 'properties' => ['requires' => []], 'health' => 3, 'energy' => null],
		['name' => 'dinner', 'image' => 'dinner.jpg', 'price' => 15, 'weight' => 3, 'premium' => 0, 'properties' => ['requires' => []], 'health' => 5, 'energy' => null],
		['name' => 'kebab', 'image' => 'kebab.jpg', 'price' => 20, 'weight' => 4, 'premium' => 0, 'properties' => ['requires' => []], 'health' => 7, 'energy' => null],
		['name' => 'pizza', 'image' => 'pizza.jpg', 'price' => 25, 'weight' => 5, 'premium' => 0, 'properties' => ['requires' => []], 'health' => 10, 'energy' => null],
		['name' => 'water', 'image' => 'water.jpg', 'price' => 5, 'weight' => 3, 'premium' => 0, 'properties' => ['requires' => []], 'health' => null, 'energy' => 1],
		['name' => 'juice', 'image' => 'juice.jpg', 'price' => 10, 'weight' => 3, 'premium' => 0, 'properties' => ['requires' => []], 'health' => null, 'energy' => 3],
		['name' => 'tea', 'image' => 'tea.jpg', 'price' => 15, 'weight' => 3, 'premium' => 0, 'properties' => ['requires' => []], 'health' => null, 'energy' => 5],
		['name' => 'coffee', 'image' => 'coffee.jpg', 'price' => 20, 'weight' => 3, 'premium' => 0, 'properties' => ['requires' => []], 'health' => null, 'energy' => 7],
		['name' => 'energy-drink', 'image' => 'energy-drink.jpg', 'price' => 25, 'weight' => 3, 'premium' => 0, 'properties' => ['requires' => []], 'health' => null, 'energy' => 10],
	],
	'seeds' => [
		['name' => 'critical-seed', 'image' => 'seed.png', 'price' => 20, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => ['level:1']], 'growth' => 172800, 'watering' => 43200, 'harvest' => [50, 100], 'quality' => 2],
		['name' => 'shaman-seed', 'image' => 'seed.png', 'price' => 20, 'weight' => 0, 'premium' => 0, 'properties' => ['requires' => ['plantator:5']], 'growth' => 345600, 'watering' => 43200, 'harvest' => [100, 200], 'quality' => 2],
		['name' => 'grapefruit-seed', 'image' => 'seed.png', 'price' => 35, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => ['plantator:10']], 'growth' => 259200, 'watering' => 28800, 'harvest' => [50, 150], 'quality' => 3],
		['name' => 'kush-seed', 'image' => 'seed.png', 'price' => 35, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => ['plantator:20']], 'growth' => 432000, 'watering' => 43200, 'harvest' => [125, 250], 'quality' => 3],
		['name' => 'passion-seed', 'image' => 'seed.png', 'price' => 50, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => ['plantator:35']], 'growth' => 345600, 'watering' => 21600, 'harvest' => [150, 250], 'quality' => 4],
		['name' => 'maroc-seed', 'image' => 'seed.png', 'price' => 50, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => ['plantator:50']], 'growth' => 604800, 'watering' => 64800, 'harvest' => [200, 350], 'quality' => 4],
		['name' => 'skunk-seed', 'image' => 'seed.png', 'price' => 100, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => ['plantator:75']], 'growth' => 604800, 'watering' => 28800, 'harvest' => [200, 350], 'quality' => 5],
		['name' => 'golden-seed', 'image' => 'golden-seed.png', 'price' => 10, 'weight' => 1, 'premium' => 1, 'properties' => [], 'growth' => 432000, 'watering' => 86400, 'harvest' => [250, 500], 'quality' => 5],
		['name' => 'tutorial-seed', 'image' => 'seed.png', 'price' => 20, 'weight' => 1, 'premium' => 0, 'properties' => [], 'growth' => 300, 'watering' => 150, 'harvest' => [25, 50], 'quality' => 3],
	],
	'stuffs' => [
		['name' => 'critical-stuff', 'image' => 'stuff.png', 'price' => 10, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => []], 'quality' => 0],
		['name' => 'shaman-stuff', 'image' => 'stuff.png', 'price' => 10, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => []], 'quality' => 0],
		['name' => 'grapefruit-stuff', 'image' => 'stuff.png', 'price' => 10, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => []], 'quality' => 0],
		['name' => 'kush-stuff', 'image' => 'stuff.png', 'price' => 10, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => []], 'quality' => 0],
		['name' => 'passion-stuff', 'image' => 'stuff.png', 'price' => 10, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => []], 'quality' => 0],
		['name' => 'maroc-stuff', 'image' => 'stuff.png', 'price' => 10, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => []], 'quality' => 0],
		['name' => 'skunk-stuff', 'image' => 'stuff.png', 'price' => 10, 'weight' => 1, 'premium' => 0, 'properties' => ['requires' => []], 'quality' => 0],
		['name' => 'tutorial-stuff', 'image' => 'stuff.png', 'price' => 15, 'weight' => 1, 'premium' => 0, 'properties' => [], 'quality' => 0],
		['name' => 'golden-stuff', 'image' => 'golden-stuff.png', 'price' => 50, 'weight' => 1, 'premium' => 0, 'properties' => [], 'quality' => 0],
	],
	'vehicles' => [
		['name' => 'bicycle', 'image' => 'bicycle.jpg', 'price' => 100, 'weight' => 100, 'premium' => 0, 'properties' => ['requires' => []], 'speed' => 12.5, 'cost' => 0, 'type' => 'bike', 'capacity' => 0],
		['name' => 'scooter', 'image' => 'scooter.jpg', 'price' => 500, 'weight' => 100, 'premium' => 0, 'properties' => ['requires' => []], 'speed' => 16.5, 'cost' => 1, 'type' => 'bike', 'capacity' => 100],
		['name' => 'quad', 'image' => 'quad.jpg', 'price' => 1500, 'weight' => 100, 'premium' => 0, 'properties' => ['requires' => []], 'speed' => 18, 'cost' => 1, 'type' => 'bike', 'capacity' => 150],
		['name' => 'cross', 'image' => 'cross.jpg', 'price' => 3000, 'weight' => 100, 'premium' => 0, 'properties' => ['requires' => []], 'speed' => 16.5, 'cost' => 1, 'type' => 'bike', 'capacity' => 250],
		['name' => 'motor', 'image' => 'motor.jpg', 'price' => 10000, 'weight' => 100, 'premium' => 0, 'properties' => ['requires' => []], 'speed' => 21, 'cost' => 2, 'type' => 'bike', 'capacity' => 250],
		['name' => 'city-car', 'image' => 'city-car.jpg', 'price' => 25000, 'weight' => 100, 'premium' => 0, 'properties' => ['requires' => []], 'speed' => 22.5, 'cost' => 2.5, 'type' => 'bike', 'capacity' => 500],
		['name' => 'chaser', 'image' => 'chaser.jpg', 'price' => 25000, 'weight' => 100, 'premium' => 0, 'properties' => ['requires' => []], 'speed' => 25, 'cost' => 5, 'type' => 'bike', 'capacity' => 250],
		['name' => 'racing-car', 'image' => 'racing-car.jpg', 'price' => 100000, 'weight' => 100, 'premium' => 0, 'properties' => ['requires' => []], 'speed' => 25, 'cost' => 4, 'type' => 'bike', 'capacity' => 500],
		['name' => 'limousine', 'image' => 'limousine.jpg', 'price' => 1000000, 'weight' => 100, 'premium' => 0, 'properties' => ['requires' => []], 'speed' => 25, 'cost' => 3, 'type' => 'bike', 'capacity' => 750],
		['name' => 'helicopter', 'image' => 'helicopter.jpg', 'price' => 5000000, 'weight' => 100, 'premium' => 0, 'properties' => ['requires' => []], 'speed' => 250, 'cost' => 100, 'type' => 'bike', 'capacity' => 75],
	],
];
?>
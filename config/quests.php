<?php

return [

	/*'' => [

		'auto' => 0,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => [],
		'objectives' => [],
		'accept' => [],
		'requires' => [],
	],*/

	'comming-with-help' => [

		'auto' => 0,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5'],
		'objectives' => ['money:20'],
		'accept' => [],
		'requires' => [],
	],


	'money-on-streets' => [

		'auto' => 0,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5'],
		'objectives' => ['dealCount:20'],
		'accept' => ['stuff:auto-dwarf-stuff,20,5'],
		'requires' => ['space:20', 'quest:comming-with-help'],
	],

	'trip' => [

		'auto' => 1,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5', 'start:where-is-bobby'],
		'objectives' => ['travelTo:tutorial-village'],
		'accept' => [],
		'requires' => ['quest:money-on-streets'],
	],

	'where-is-bobby' => [

		'auto' => 1,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5'],
		'objectives' => ['visit:bobbys-house'],
		'accept' => [],
		'requires' => ['quest:trip'],
	],

	'more-water' => [

		'auto' => 0,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5', 'itemTake:water,1'],
		'objectives' => ['buySpecific:water'],
		'accept' => [],
		'requires' => ['quest:where-is-bobby'],
	],

	'from-seeds' => [

		'auto' => 1,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5', 'start:el-greenado'],
		'objectives' => ['buyType:seed,5'],
		'accept' => [],
		'requires' => ['quest:more-water'],
	],

	'el-greenado' => [

		'auto' => 1,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5', 'start:shovel-in-hands'],
		'objectives' => ['visit:tutorial-plantation'],
		'accept' => [],
		'requires' => ['quest:from-seeds'],
	],

	'shovel-in-hands' => [

		'auto' => 1,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5', 'start:artifical-rain'],
		'objectives' => ['plant:1'],
		'accept' => [],
		'requires' => ['quest:el-greenado'],
	],

	'artifical-rain' => [

		'auto' => 1,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5', 'start:harvest-time'],
		'objectives' => ['watering:1'],
		'accept' => [],
		'requires' => ['quest:shovel-in-hands'],
	],

	'harvest-time' => [

		'auto' => 1,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5', 'start:back-to-bobby'],
		'objectives' => ['harvestPlant:5'],
		'accept' => [],
		'requires' => ['quest:artifical-rain'],
	],

	'back-to-bobby' => [

		'auto' => 1,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5'],
		'objectives' => ['visit:bobbys-house'],
		'accept' => [],
		'requires' => ['quest:harvest-time'],
	],

	'back-to-mike' => [

		'auto' => 1,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5'],
		'objectives' => ['visit:mikes-house'],
		'accept' => [],
		'requires' => ['quest:back-to-bobby'],
	],

	'streets-in-green' => [

		'auto' => 0,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5'],
		'objectives' => ['dealCount:35'],
		'accept' => [],
		'requires' => ['quest:back-to-mike'],
	],

	'shopping' => [

		'auto' => 0,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['takeItemType:weapon,1', 'takeItemType:armor,1'],
		'objectives' => ['buyType:weapon,2', 'buyType:armor,2'],
		'accept' => [],
		'requires' => ['quest:streets-in-green'],
	],

	'new-image' => [

		'auto' => 0,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5'],
		'objectives' => ['equip:weapon', 'equip:armor'],
		'accept' => [],
		'requires' => ['quest:shooping'],
	],

	'great-escape' => [

		'auto' => 1,
		'breakable' => 0,
		'daily' => 0,
		'repeatable' => 0,
		'rewards' => ['experience:5'],
		'objectives' => ['visit:tutorial-train-station'],
		'accept' => [],
		'requires' => ['quest:new-image'],
	],


];
?>
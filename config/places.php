<?php

return [
	[
		'name' => 'tutorial-buletin-board',
		'image' => 'bulletin-board.jpg',
		'visible' => false,
		'components' => ['work'],
		'properties' => ['work' => ['groups' => 'tutorial-works', 'atOnce' => 1, 'perGroup' => 1, 'resetable' => 0]],
		'requires' => []
	],
	[
		'name' => 'tutorial-growshop',
		'image' => 'growshop.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'tutorial-growshop', 'items' => 1]],
		'requires' => ['quest:first-work']
	],
	[
		'name' => 'tutorial-plantation',
		'image' => 'plantation.jpg',
		'visible' => false,
		'components' => ['plantation'],
		'properties' => ['plantation' => ['light' => 1, 'ground' => 1, 'slots' => 1]],
		'requires' => ['quest:first-seed']
	],
	[
		'name' => 'tutorial-street',
		'image' => 'street.jpg',
		'visible' => false,
		'components' => ['dealing'],
		'properties' => ['dealing' => ['durationMin' => 1, 'durationMax' => 1, 'energy' => 10, 'minPrice' => 5, 'maxPrice' => 20, 'minInterval' => 2000, 'maxInterval' => 2000, 'minStuff' => 15, 'maxStuff' => 15, 'beatChance' => 0, 'burnChance' => 100]],
		'requires' => ['quest:first-plant']
	],
	[
		'name' => 'tutorial-bus-stop',
		'image' => 'bus-stop.jpg',
		'visible' => false,
		'components' => ['travel'],
		'properties' => ['travel' => ['cost' => 0.1, 'speed' => 4, 'available' => 'capital']],
		'requires' => ['quest:first-deal']
	],
	[
		'name' => 'warehouse',
		'image' => 'warehouse.jpg',
		'visible' => false,
		'components' => ['store', 'rent', 'work'],
		'properties' => ['store' => ['deny' => 'vehicle', 'baseCapacity' => 200, 'capacityPerLevel' => 100, 'capacityPerPremiumLevel' => 250, 'levelPrice' => 500, 'premiumLevelPrice' => 2, 'levelBasePrice' => 1000, 'premiumLevelBasePrice' => 1], 'rent' => ['cost' => 250, 'duration' => 604800], 'work' => ['groups' => 'warehouse', 'reset' => 21600, 'atOnce' => 1, 'perGroup' => 1, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800]],
		'requires' => []
	],
	[
		'name' => 'garage',
		'image' => 'garage.jpg',
		'visible' => false,
		'components' => ['store', 'rent'],
		'properties' => ['store' => ['allow' => 'vehicle', 'baseCapacity' => 500, 'capacityPerLevel' => 100, 'capacityPerPremiumLevel' => 200, 'levelPrice' => 250, 'premiumLevelPrice' => 1, 'levelBasePrice' => 500, 'premiumLevelBasePrice' => 1], 'rent' => ['cost' => 150, 'duration' => 604800]],
		'requires' => []
	],
	[
		'name' => 'bus-stop',
		'image' => 'bus-stop.jpg',
		'visible' => false,
		'components' => ['travel'],
		'properties' => ['travel' => ['cost' => 0.25, 'speed' => 20, 'available' => 'city,village']],
		'requires' => []
	],
	[
		'name' => 'train-station',
		'image' => 'train-station.jpg',
		'visible' => false,
		'components' => ['travel'],
		'properties' => ['travel' => ['cost' => 1, 'speed' => 40, 'available' => 'city']],
		'requires' => []
	],
	[
		'name' => 'bulletin-board',
		'image' => 'bulletin-board.jpg',
		'visible' => false,
		'components' => ['work'],
		'properties' => ['work' => ['groups' => 'bulletin-board', 'reset' => 86400, 'atOnce' => 2, 'perGroup' => 4, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800]],
		'requires' => []
	],
	[
		'name' => 'plantation',
		'image' => 'plantation.jpg',
		'visible' => false,
		'components' => ['plantation', 'investment'],
		'properties' => ['plantation' => ['light' => 1, 'ground' => 1, 'slots' => 5], 'investment' => ['name' => 'hemp-field', 'price' => 350000]],
		'requires' => []
	],
	[
		'name' => 'street',
		'image' => 'street.jpg',
		'visible' => false,
		'components' => ['dealing'],
		'properties' => ['dealing' => ['durationMin' => 1, 'durationMax' => 10, 'energy' => 10, 'minPrice' => 5, 'maxPrice' => 20, 'minInterval' => 600, 'maxInterval' => 1800, 'minStuff' => 2, 'maxStuff' => 5, 'beatChance' => 30, 'burnChance' => 25]],
		'requires' => []
	],
	[
		'name' => 'grocery-store',
		'image' => 'convenience-store.jpg',
		'visible' => false,
		'components' => ['shop', 'investment', 'work'],
		'properties' => ['shop' => ['name' => 'grocery-store', 'delivery' => 86400, 'items' => 5, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800], 'investment' => ['name' => 'grocery-store', 'price' => 150000, 'worksNeeded' => 100, 'groups' => 'shop-boss'], 'work' => ['groups' => 'shop', 'reset' => 21600, 'atOnce' => 2, 'perGroup' => 2, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800]],
		'requires' => []
	],
	[
		'name' => 'gun-shop',
		'image' => 'gun-shop.jpg',
		'visible' => false,
		'components' => ['shop', 'work'],
		'properties' => ['shop' => ['name' => 'gun-shop', 'delivery' => 86400, 'items' => 4, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800], 'work' => ['groups' => 'shop', 'reset' => 21600, 'atOnce' => 2, 'perGroup' => 2, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800]],
		'requires' => []
	],
	[
		'name' => 'grow-shop',
		'image' => 'growshop.jpg',
		'visible' => false,
		'components' => ['shop', 'work'],
		'properties' => ['shop' => ['name' => 'grow-shop', 'delivery' => 86400, 'items' => 5, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800], 'work' => ['groups' => 'shop', 'reset' => 21600, 'atOnce' => 2, 'perGroup' => 2, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800]],
		'requires' => []
	],
	[
		'name' => 'sport-shop',
		'image' => 'sport-shop.jpg',
		'visible' => false,
		'components' => ['shop', 'work'],
		'properties' => ['shop' => ['name' => 'sport-shop', 'delivery' => 86400, 'items' => 4, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800], 'work' => ['groups' => 'shop', 'reset' => 21600, 'atOnce' => 2, 'perGroup' => 2, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800]],
		'requires' => []
	],
	[
		'name' => 'black-market',
		'image' => 'black-market.jpg',
		'visible' => false,
		'components' => ['market'],
		'properties' => ['market' => ['minPrice' => 50, 'maxPrice' => 100, 'allow' => 'stuff'], 'requires' => ['level:5']],
		'requires' => []
	],
	[
		'name' => 'toy-store',
		'image' => 'toy-store.jpg',
		'visible' => false,
		'components' => ['shop', 'work'],
		'properties' => ['shop' => ['name' => 'toy-store', 'delivery' => 86400, 'items' => 3, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800], 'work' => ['groups' => 'shop', 'reset' => 21600, 'atOnce' => 2, 'perGroup' => 2, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800]],
		'requires' => []
	],
	[
		'name' => 'car-showroom',
		'image' => 'show-room.jpg',
		'visible' => false,
		'components' => ['shop', 'investment'],
		'properties' => ['shop' => ['name' => 'car-showroom', 'delivery' => 86400, 'items' => 3, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800], 'investment' => ['name' => 'car-showroom', 'price' => 250000]],
		'requires' => []
	],
	[
		'name' => 'miscellaneous-store',
		'image' => 'miscellaneous-store.jpg',
		'visible' => false,
		'components' => ['shop', 'work'],
		'properties' => ['shop' => ['name' => 'miscellaneous-store', 'delivery' => 86400, 'items' => 4, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800], 'work' => ['groups' => 'shop', 'reset' => 21600, 'atOnce' => 2, 'perGroup' => 2, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800]],
		'requires' => []
	],
	[
		'name' => 'motorcycle-shop',
		'image' => 'motorcycle-shop.jpg',
		'visible' => false,
		'components' => ['shop'],
		'properties' => ['shop' => ['name' => 'motorcycle-shop', 'delivery' => 86400, 'items' => 3, 'resetable' => 1, 'resetCost' => 2, 'resetCooldown' => 28800]],
		'requires' => []
	],
	[
		'name' => 'vehicle-exchange',
		'image' => 'vehicle-exchange.jpg',
		'visible' => false,
		'components' => ['market'],
		'properties' => ['market' => ['minPrice' => 33, 'maxPrice' => 200, 'allow' => 'vehicle']],
		'requires' => []
	],
	[
		'name' => 'outgoing-road',
		'image' => 'outgoing-road.jpg',
		'visible' => true,
		'components' => ['vehicleTravel'],
		'properties' => ['vehicleTravel' => ['available' => 'city, village']],
		'requires' => ['equiped:vehicle']
	],
	[
		'name' => 'police-station',
		'image' => 'police-station.jpg',
		'visible' => true,
		'components' => ['arrest'],
		'properties' => ['arrest' => ['duration' => 7200]],
		'requires' => []
	],
	[
		'name' => 'dump',
		'image' => 'dump.jpg',
		'visible' => true,
		'components' => ['work'],
		'properties' => ['work' => ['groups' => 'dump', 'reset' => 28800, 'atOnce' => 1, 'perGroup' => 1]],
		'requires' => []
	],
	[
		'name' => 'restaurant',
		'image' => 'restaurant.jpg',
		'visible' => true,
		'components' => ['investment'],
		'properties' => ['investment' => ['name' => 'restaurant', 'price' => 300000, 'worksNeeded' => 175]],
		'requires' => []
	],
	[
		'name' => 'casino',
		'image' => 'casino.jpg',
		'visible' => true,
		'components' => ['investment', 'gambling'],
		'properties' => ['investment' => ['name' => 'casino', 'price' => 1000000, 'worksNeeded' => 250], 'gambling' => ['minBet' => 50, 'maxBet' => 2500, 'exchange' => 1.7, 'duration' => 1200]],
		'requires' => []
	],
	[
		'name' => 'night-club',
		'image' => 'night-club.jpg',
		'visible' => true,
		'components' => ['work', 'investment'],
		'properties' => ['work' => ['groups' => 'club', 'reset' => 21600, 'atOnce' => 1, 'perGroup' => 1], 'investment' => ['name' => 'night-club', 'price' => 500000, 'worksNeeded' => 200]],
		'requires' => []
	],
	[
		'name' => 'hotel',
		'image' => 'hotel.jpg',
		'visible' => true,
		'components' => ['investment'],
		'properties' => ['investment' => ['name' => 'hotel', 'price' => 750000, 'worksNeeded' => 225]],
		'requires' => []
	],
	[
		'name' => 'bank',
		'image' => 'bank.jpg',
		'visible' => true,
		'components' => ['investment', 'bank'],
		'properties' => ['investment' => ['name' => 'bank', 'price' => 75000]],
		'requires' => []
	],
	[
		'name' => 'pub',
		'image' => 'pub.jpg',
		'visible' => true,
		'components' => ['work', 'investment'],
		'properties' => ['work' => ['groups' => 'club', 'reset' => 21600, 'atOnce' => 1, 'perGroup' => 1], 'investment' => ['name' => 'pub', 'price' => 200000, 'worksNeeded' => 150]],
		'requires' => []
	],
	[
		'name' => 'game-room',
		'image' => 'game-room.jpg',
		'visible' => true,
		'components' => ['investment', 'gambling'],
		'properties' => ['investment' => ['name' => 'game-room', 'price' => 150000], 'gambling' => ['minBet' => 5, 'maxBet' => 100, 'exchange' => 2, 'duration' => 600]],
		'requires' => []
	],
	[
		'name' => 'motel',
		'image' => 'motel.jpg',
		'visible' => true,
		'components' => ['investment'],
		'properties' => ['investment' => ['name' => 'motel', 'price' => 250000]],
		'requires' => []
	],
	[
		'name' => 'sanctuary',
		'image' => 'sanctuary.jpg',
		'visible' => true,
		'components' => ['church'],
		'properties' => ['church' => ['price' => 100, 'bonus' => 15, 'duration' => 28800]],
		'requires' => []
	],
	[
		'name' => 'church',
		'image' => 'church.jpg',
		'visible' => true,
		'components' => ['church'],
		'properties' => ['church' => ['price' => 50, 'bonus' => 7, 'duration' => 28800]],
		'requires' => []
	],
	[
		'name' => 'chapel',
		'image' => 'chapel.jpg',
		'visible' => true,
		'components' => ['church'],
		'properties' => ['church' => ['price' => 25, 'bonus' => 3, 'duration' => 28800]],
		'requires' => []
	],
	[
		'name' => 'hospital',
		'image' => 'hospital.jpg',
		'visible' => true,
		'components' => ['hospital'],
		'properties' => ['hospital' => ['normalSpeed' => 360, 'normalPrice' => 3, 'fastSpeed' => 288, 'fastPrice' => 5]],
		'requires' => []
	],
	[
		'name' => 'clinic',
		'image' => 'clinic.jpg',
		'visible' => true,
		'components' => ['hospital'],
		'properties' => ['hospital' => ['normalSpeed' => 432, 'normalPrice' => 1, 'fastSpeed' => 360, 'fastPrice' => 3]],
		'requires' => []
	],
	[
		'name' => 'den',
		'image' => 'den.jpg',
		'visible' => true,
		'components' => ['attack'],
		'properties' => ['attack' => ['minLevel' => 10, 'threshold' => 25]],
		'requires' => ['level:10']
	],
	[
		'name' => 'headquarters',
		'image' => 'headquarters.jpg',
		'visible' => true,
		'components' => ['gang'],
		'properties' => [],
		'requires' => ['level:10']
	],
	[
		'name' => 'gang-bank',
		'image' => 'gang-bank.jpg',
		'visible' => false,
		'components' => ['gang-bank'],
		'properties' => [],
		'requires' => ['gang:']
	],
	[
		'name' => 'gang-warehouse',
		'image' => 'gang-warehouse.jpg',
		'visible' => false,
		'components' => ['gang-store'],
		'properties' => ['gang-store' => ['deny' => 'vehicle', 'baseCapacity' => 500, 'capacityPerLevel' => 100, 'capacityPerPremiumLevel' => 200, 'levelPrice' => 1000, 'premiumLevelPrice' => 5, 'levelBasePrice' => 2500, 'premiumLevelBasePrice' => 3]],
		'requires' => ['gang:']
	],
	[
		'name' => 'town-hall',
		'image' => 'town-hall.jpg',
		'visible' => true,
		'components' => ['npc'],
		'properties' => ['npc' => ['name' => 'secretary']],
		'requires' => []
	],
];
?>
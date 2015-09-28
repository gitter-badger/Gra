<?php


return [

	'arrest' => 'Areszt',
	'shop' => 'Sklep',
	'store' => 'Magazyn',
	'travel' => 'Podróżowanie',
	'vehicleTravel' => 'Podróżowanie pojazdem',
	'rent' => 'Do wynajęcia',
	'work' => 'Prace',
	'plantation' => 'Plantacja',
	'dealing' => 'Sprzedaż ganji',
	'market' => 'Market',
	'gambling' => 'Hazard',
	'bank' => 'Bank',
	'church' => 'Kaplica',
	'hospital' => 'Leczenie',
	'attack' => 'Napad',
	'gang' => 'Gang',
	'gang-bank' => 'Skarbiec gangu',
	'gang-store' => 'Magazyn gangu',
	'npc' => 'Postać niezależna',
	'investment' => 'Inwestycja',


	'properties' => [

		'shop' => [

			'name' => 'Szablon sklepu',
			'delivery' => 'Dostawy co [s]',
			'items' => 'Przedmioty na raz w sklepie',
			'resetable' => 'Wymuszenie dostawy',
			'resetCost' => 'Koszt wymuszenia [pp]',
			'resetCooldown' => 'Czas oczekiwania pomiędzy wymuszonymi dostawami',
		],


		'store' => [

			'allow' => 'Dozwolone przedmioty',
			'deny' => 'Zabronione przedmioty',
			'baseCapacity' => 'Bazowa pojemność',
			'capacityPerLevel' => 'Pojemność na poziom',
			'capacityPerPremiumLevel' => 'Pojemność na poziom premium',
			'levelPrice' => 'Dostakowy koszt rozbudowy na poziom',
			'premiumLevelPrice' => 'Dodatkowy koszt rozbudowy na poziom premium [pp]',
			'baseLevelPrice' => 'Bazowa cena za poziom',
			'basePremiumLevelPrice' => 'Bazowa cena za poziom premium',
		],

		'travel' => [

			'cost' => 'Koszt podróży',
			'speed' => 'Szybkość podróży',
			'available' => 'Dozwolone lokacje',
		],

		'vehicleTravel' => [

			'available' => 'Dozwolone lokacje',
		],

		'rent' => [

			'cost' => 'Koszt wynajmu',
			'duration' => 'Czas wynajmu [s]',
		],

		'work' => [

			'groups' => 'Dostępne grupy zadań',
			'reset' => 'Czas odnowienia prac [s]',
			'atOnce' => 'Ilość prac wyświetlanych na raz',
			'perGroup' => 'Ilość prac na każdą grupę',
			'resetable' => 'Można wybusić odnowienie',
			'resetCost' => 'Koszt odnowienia [pp]',
			'resetCooldown' => 'Czas oczekiwania na ponowne wymuszone odnowienie [s]',
		],

		'plantation' => [

			'light' => 'Współczynnik naświetlenia',
			'ground' => 'Jakość ziemi',
			'slots' => 'Miejsca na rośliny',
		],

		'arrest' => [

			'duration' => 'Czas odsiadki na gwiazdkę [s]',
		],

		'investment' => [

			'name' => 'Nazwa szablonu',
			'price' => 'Cena kupna',
			'worksNeeded' => 'Prace wymagane do odblokowania inwestycji',
			'groups' => 'Grupy prac po kupieniu inwestycji',
		],

		'dealing' => [

			'durationMin' => 'Minimalny czas sprzedaży [10m]',
			'durationMax' => 'Maksymalny czas sprzedaży [10m]',
			'energy' => 'Koszt energii na jednostkę czasu',
			'minPrice' => 'Minimalna cena zioła',
			'maxPrice' => 'Maksymalna cena zioła',
			'intervalMin' => 'Minimalny czas oczekiwania na klienta [s]',
			'intervalMax' => 'Maksymalny czas oczekiwania na klienta [s]',
			'minStuff' => 'Minimalna bazowa ilość sprzedanego towaru',
			'maxStuff' => 'Maksymalna bazowa ilość sprzedanego towaru',
			'beatChance' => 'Szansa na walkę [0-100]%',
			'burnChance' => 'Szansa na dostanie gwiazdki [0-100]%',

		],

		'market' => [

			'minPrice' => 'Minimalna cena towaru',
			'maxPrice' => 'Maksymalna cena towaru',
			'allow' => 'Dozwolone typy przedmiotów',
			'deny' => 'Zabronione typy przedmiotów',
		],

		'gambling' => [

			'minBet' => 'Minimalny zakład',
			'maxBet' => 'Maksymalny zakład',
			'exchange' => 'Kurs',
			'duration' => 'Czas trwania [s]',
		],

		'church' => [

			'price' => 'Cena bazowa',
			'bonus' => 'Premia do szczęścia',
			'duration' => 'Czas odnowienia [s]',
		],

		'hospital' => [

			'normalSpeed' => 'Czas odnowienia 1 punktu zdrowia [s]',
			'normalPrice' => 'Koszt odnowienia 1 punktu zdrowia',
			'fastSpeed' => 'Czas szybkiego odnowienia 1 punktu zdrowia [s]',
			'fastPrice' => 'Koszt szybkiego odnowienia 1 punktu zdrowia',
		],

		'attack' => [

			'minLevel' => 'Minimalny poziom atakowanej postaci',
			'threshold' => 'Maksymalna różnica poziomów',
		],


		'gang-store' => [

			'allow' => 'Dozwolone przedmioty',
			'deny' => 'Zabronione przedmioty',
			'baseCapacity' => 'Bazowa pojemność',
			'capacityPerLevel' => 'Pojemność na poziom',
			'capacityPerPremiumLevel' => 'Pojemność na poziom premium',
			'levelPrice' => 'Dostakowy koszt rozbudowy na poziom',
			'premiumLevelPrice' => 'Dodatkowy koszt rozbudowy na poziom premium [pp]',
			'baseLevelPrice' => 'Bazowa cena za poziom',
			'basePremiumLevelPrice' => 'Bazowa cena za poziom premium',
		],

		'npc' => [

			'name' => 'Nazwa postaci',
		],
	],

];
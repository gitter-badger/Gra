<?php

return [
	'title' => 'Tytuł',
	'date' => 'Data',
	'content' => 'Zawartość',

	'welcome' => [

		'title' => 'Witamy w HempEmpire!',
		'content' => 'Naszym celem było stworzenie gry która pozwoli Ci się wczuć w proczes produkcji oraz rozpowszechniania ganji. Twoim celem w tej grze jest dobrze się bawić i zdobyć tyle kasy ile tylko potrafisz unieść. Życzymi miłej zabawy - zespół HempEmpire',
	],


	'deal' => [

		'title' => 'Sprzedałeś :sell sztuk towaru zarabiając $:price',
		'content' => ':text',
	],

	'harvest' => [

		'title' => 'Zebrałeś :count sztuk :name',
		'content' => 'Opieka nad roślinami opłacała się! Zebrałeś :count sztuk :name',
	],

	'levelup' => [

		'title' => 'Awansowałeś na poziom :level',
		'content' => 'Awansując na kolejny poziom i zyskałeś :statistics punktów statystyk'
	],

	'plantator-levelup' => [

		'title' => 'Awansowałeś na poziom :level plantatora',
		'content' => 'Umiesz się lepiej obchodzić z roślinami przez co one są szczęśliwsze a Ty zgarniasz większe plony',
	],

	'dealer-levelup' => [

		'title' => 'Awansowałeś na poziom :level dealera',
		'content' => 'Sprzedając towar na ulicy poszeżasz swoje znajomości przez co masz dostęp do klientów z większymi potrzebami',
	],

	'smuggler-levelup' => [

		'title' => 'Awansowałeś na poziom :level przemytnika',
		'content' => 'Twoje umiejętności rosną i czujesz się pewniej prowadząc pojazd',
	],

	'market-bought' => [

		'title' => 'Ktoś kupił :item (:count)',
		'content' => 'Ktoś kupił :item (:count), zarobiłeś :price',
	],

	'quest-started' => [

		'title' => 'Rozpocząłeś zadanie :name',
		'content' => ':text',
	],

	'quest-completed' => [

		'title' => 'Zakończyłeś zadanie :name',
		'content' => ':text',
	],

	'arrested' => [

		'title' => 'Zostałeś aresztowany',
		'content' => ':text',
	],

	'search' => [

		'title' => 'Zostałeś przeszukany przez policję',
		'content' => 'Znaleźli przy Tobie :count sztuk zioła. Niestety musisz spędzić :duration w areszcie',
	],

	'battle-win' => [

		'title' => 'Wygrałeś walkę',
		'content' => '<p>:reason</p>:log <canvas id="battleView" width="600px" height="450px"></canvas><p>:rewards</p>',
	],

	'battle-lose' => [

		'title' => 'Przegrałeś walkę',
		'content' => '<p>:reason</p>:log <canvas id="battleView" width="600px" height="450px"></canvas><p>:rewards</p>',
	],

	'gang-battle-win' => [

		'title' => 'Twój gang wygrał walkę',
		'content' => '<p>:reason</p>:log <canvas id="battleView" width="600px" height="450px"></canvas><p>:rewards</p>',
	],

	'gang-battle-lose' => [

		'title' => 'Twój gang przegrał walkę',
		'content' => '<p>:reason</p>:log <canvas id="battleView" width="600px" height="450px"></canvas><p>:rewards</p>',
	],

	'invitation' => [

		'title' => 'Zostałeś zaproszony do gangu :gang',
		'content' => 'Gracz :by zaprosił Cię do gangu :gang',
	],

	'kick' => [

		'title' => 'Zostałeś wyrzucony z gangu :gang',
		'content' => 'Gracz :by wyrzucił Cię z gangu :gang',
	],

	'promoted' => [

		'title' => 'Zostałeś awansowany',
		'content' => 'Gracz :by awansował Cię na :role',
	],

	'demoted' => [

		'title' => 'Zostałeś degradowany',
		'content' => 'Gracz :by zdegradował Cię na :role',
	],

	'invitationCanceled' => [

		'title' => 'Gang :gang cofnął zaproszenie',
		'content' => 'Gracz :by z gangu :gang cofnął zaproszenie',
	],

	'gang-attack' => [

		'title' => 'Zostałeś wezwany do broni',
		'content' => 'Twój gang planuje atak na :gang o :at',
	],

	'gang-defend' => [

		'title' => 'Zostałeś wezwany do broni',
		'content' => 'Wrogi gang :gang planuje atak na Twój gang o :at',
	],
];
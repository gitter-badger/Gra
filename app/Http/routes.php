<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
use HempEmpire\World;
use HempEmpire\Player;


Route::group(['domain' => 'gra.pl'], function()
{
	Route::get('/', ['as' => 'home', 'middleware' => 'guest', function()
	{
	    return view('home');
	}]);


	Route::controller('/auth/password', 'Auth\PasswordController');
	Route::controller('/auth/facebook', 'Auth\FacebookController');


	Route::get('/auth/verify/{token}', ['as' => 'user.verify', 'uses' => 'Auth\AuthController@verify']);
	Route::controller('/auth', 'Auth\AuthController', [

		'postLogin' => 'user.login',
		'postRegister' => 'user.register',
		'getLogout' => 'user.logout',
	]);


	Route::group(['prefix' => '/payments'], function()
	{
		Route::controller('/fortumo', 'Payments\FortumoController');
		Route::controller('/transferuj', 'Payments\TransferujController');
	});


	Route::post('queue/receive', function()
	{
		return Queue::marshal();
	});

	Route::get('/worlds', ['as' => 'world.list', function()
	{
		return view('world')
			->with('worlds', World::all());
	}]);

	Route::get('/lang/{lang}', function($lang)
	{
		$redirect = redirect()->back();

		if(array_search($lang, Config::get('app.languages')) !== false)
		{
			$redirect->withCookie('lang', $lang, 10 * 365 * 24 * 60, '/', 'gra.pl', false, true);
		}

		return $redirect;
	});
});



Route::group(['domain' => '{server}.gra.pl', 'before' => 'worldSelect', 'middleware' => 'world'], function()
{
	Route::get('/player/{name}', ['as' =>'player.doReference', 'uses' => 'Player\PlayerController@doReference', 'middleware' => 'world']);

	Route::group(['middleware' => ['auth', 'verified']], function()
	{		
		Route::controller('/user', 'UserController', [

			'getIndex' => 'user.index',
			'getChange' => 'user.change',
			'getTutorial' => 'user.tutorial',
			'getFacebook' => 'user.facebook',
			'getLanguage' => 'user.language',
		]);

		Route::group(['prefix' => '/admin', 'middleware' => 'admin'], function()
		{
			Route::get('/', ['as' => 'admin.index', function()
			{
				return view('admin.main');
			}]);

			Route::resource('/world', 'Admin\WorldController', ['except' => ['store']]);

			Route::get('/location/export', ['as' => 'admin.location.export', 'uses' => 'Admin\LocationController@export']);
			Route::resource('/location', 'Admin\LocationController');

			Route::get('/place/export', ['as' => 'admin.place.export', 'uses' => 'Admin\PlaceController@export']);
			Route::resource('/place', 'Admin\PlaceController');


			Route::group(['prefix' => '/item'], function()
			{
				Route::get('/', ['as' => 'admin.item.index', function()
				{
					return view('admin.item.types')
						->with('armorsCount', \HempEmpire\TemplateArmor::count())
						->with('weaponsCount', \HempEmpire\TemplateWeapon::count())
						->with('foodsCount', \HempEmpire\TemplateFood::count())
						->with('seedsCount', \HempEmpire\TemplateSeed::count())
						->with('stuffsCount', \HempEmpire\TemplateStuff::count())
						->with('vehiclesCount', \HempEmpire\TemplateVehicle::count());
				}]);

				Route::get('/export', ['as' => 'admin.item.export', 'uses' => 'Admin\ItemController@export']);

				Route::resource('/weapon', 'Admin\WeaponController');
				Route::resource('/armor', 'Admin\ArmorController');
				Route::resource('/food', 'Admin\FoodController');
				Route::resource('/seed', 'Admin\SeedController');
				Route::resource('/stuff', 'Admin\StuffController');
				Route::resource('/vehicle', 'Admin\VehicleController');
			});


			Route::get('/shop/export', ['as' => 'admin.shop.export', 'uses' => 'Admin\ShopController@export']);
			Route::resource('/shop', 'Admin\ShopController');
			Route::resource('/shop.delivery', 'Admin\ShopDeliveryController', ['except' => ['index']]);

			Route::get('/workGroup/export', ['as' => 'admin.workGroup.export', 'uses' => 'Admin\WorkGroupController@export']);
			Route::resource('/workGroup', 'Admin\WorkGroupController');
			Route::resource('/workGroup.work', 'Admin\WorkController', ['except' => ['index']]);


			Route::get('/quest/export', ['as' => 'admin.quest.export', 'uses' => 'Admin\QuestController@export']);
			Route::resource('/quest', 'Admin\QuestController');


			Route::get('/investment/export', ['as' => 'admin.investment.export', 'uses' => 'Admin\InvestmentController@export']);
			Route::resource('/investment', 'Admin\InvestmentController');



			Route::get('/npc/export', ['as' => 'admin.npc.export', 'uses' => 'Admin\NpcController@export']);
			Route::resource('/npc', 'Admin\NpcController');

		});

		//Player



		Route::group(['prefix' => '/api', 'middleware' => 'player'], function() 
		{
			Route::controller('/character', 'Api\PlayerController');
		});

		Route::controller('/character', 'Player\PlayerController', [

			'getIndex' => 'player.index',
			'getCreate' => 'player.create',
			'postCreate' => 'player.save',
			'getStatistics' => 'player.statistics',
			'getItems' => 'player.items',
			'postItems' => 'player.use',
			'getTalents' => 'player.talents',
			'getInvitations' => 'player.invitations',
			'postInvitations' => 'player.accept',
			'getReference' => 'player.reference',
			'getQuests' => 'player.quests',
		]);


		Route::group(['middleware' => 'player'], function()
		{
			Route::get('/game', ['as' => 'game', function()
			{

				$player = Player::getActive();


				if($player->isBusy)
				{
					return view('job');
				}
				else
				{
					$place = $player->place;
					

					if(is_null($place) || !$place->isAvailable())
					{
						return view('location')
							->with('location', $player->location);
					}
					else
					{
						$place->loadComponents();
						return $place->view();
					}
				}
			}]);

			Route::post('/game', function(Illuminate\Http\Request $request)
			{
				$player = Player::getActive();
				$response = null;


				foreach($player->quests as $quest)
					$quest->init();


				if($player->isBusy)
				{
					$response = view('job');
				}
				else
				{
					if(!$request->has('action'))
					{
						$place = $player->location->places()->whereId($request->input('place'))->first();
						$player->moveTo($place);
						
						$response = redirect()->route('game');
					}
					else
					{
						$place = $player->place;

						if(is_null($place) || !$place->isAvailable())
						{
							$response = redirect()->route('game');
						}
						else
						{
							$place->loadComponents();
							$response = $place->action($request);
						}
					}

				}

				foreach($player->quests as $quest)
					$quest->finit();

				return $response;
			});

			Route::post('/reports/readAll', ['as' => 'reports.readAll', 'uses' => 'ReportsController@readAll']);
			Route::post('/reports/destroyAll', ['as' => 'reports.destroyAll', 'uses' => 'ReportsController@destroyAll']);
			Route::resource('/reports', 'ReportsController', ['only' => ['index', 'show', 'destroy']]);




			Route::group(['prefix' => '/messages'], function()
			{
				Route::get('/', ['as' => 'message.index', 'uses' => 'MailController@getIndex']);

				Route::get('/create', ['as' => 'message.create', 'uses' => 'MailController@getCreate']);
				Route::post('/send', ['as' => 'message.send', 'uses' => 'MailController@postCreate']);


				Route::get('/inbox', ['as' => 'message.inbox.index', 'uses' => 'MailController@getInbox']);
				Route::get('/outbox', ['as' => 'message.outbox.index', 'uses' => 'MailController@getOutbox']);
				Route::get('/blacklist', ['as' => 'blacklist.index', 'uses' => 'MailController@getBlacklist']);



				Route::get('/inbox/{mail}', ['as' => 'message.inbox.view', 'uses' => 'MailController@inboxView']);
				Route::get('/outbox/{mail}', ['as' => 'message.outbox.view', 'uses' => 'MailController@outboxView']);

				Route::get('/inbox/delete/{mail}', ['as' => 'message.inbox.delete', 'uses' => 'MailController@inboxDelete']);
				Route::get('/outbox/delete/{mail}', ['as' => 'message.outbox.delete', 'uses' => 'MailController@outboxDelete']);

				Route::get('/create/reply/{mail}', ['as' => 'message.reply', 'uses' => 'MailController@reply']);
				Route::get('/create/resend/{mail}', ['as' => 'message.resend', 'uses' => 'MailController@resend']);

				Route::post('/blacklist/add', ['as' => 'blacklist.add', 'uses' => 'MailController@addBlacklist']);
				Route::get('/blacklist/remove/{player}', ['as' => 'blacklist.remove', 'uses' => 'MailController@removeBlacklist']);
			});


			Route::controller('/ranking', 'RankingController', [

				'getIndex' => 'ranking',
			]);


			Route::get('/premiumShop', ['as' => 'premiumShop', function()
			{
				return view('premiumshop');
			}]);


		});


	});


});

Route::filter('worldSelect', function($route)
{
	$worldId = substr($route->getParameter('server'), 1);
	$world = World::find($worldId);

	//dd($world);

	if(isset($world) && $world->isAvailable())
	{
		Session::set('world', $world->id);
		View::share('player', Player::getActive());
	}

	$route->forgetParameter('server');
});

















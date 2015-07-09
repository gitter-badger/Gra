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



Route::get('/', ['as' => 'home', 'middleware' => 'guest', function()
{
    return view('home');
}]);


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


Route::group(['prefix' => '/api', 'middleware' => ['auth', 'world', 'player']], function() 
{
	Route::controller('/character', 'Api\PlayerController');
});




Route::group(['middleware' => 'auth'], function()
{
	//World

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


		Route::get('/questGroup/export', ['as' => 'admin.questGroup.export', 'uses' => 'Admin\QuestGroupController@export']);
		Route::resource('/questGroup', 'Admin\QuestGroupController');
		Route::resource('/questGroup.quest', 'Admin\QuestController', ['except' => ['index']]);

	});


	Route::get('/worlds', ['as' => 'world.list', function()
	{
		return view('world')
			->with('worlds', World::all());
	}]);


	Route::get('/worlds/{world}', ['as' => 'world.select', function($world)
	{
		if(World::setSelected($world))
		{
			if(!Player::hasActive())
			{
				return redirect(route('player.create'));
			}
			else
			{
				return redirect(route('game'));
			}
		}
		else
		{
			return redirect(route('world.list'));
		}
	}]);


	Route::group(['middleware' => 'world'], function()
	{
		//Player


		Route::controller('/character', 'Player\PlayerController', [

			'getIndex' => 'player.index',
			'getCreate' => 'player.create',
			'postCreate' => 'player.save',
			'getStatistics' => 'player.statistics',
			'getItems' => 'player.items',
			'postItems' => 'player.use',
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

				if($player->isBusy)
				{
					return view('job');
				}
				else
				{
					if(!$request->has('action'))
					{
						$newPlace = $request->input('place');

						if(strlen($newPlace) == 0)
							$newPlace = null;


						if(is_null($newPlace) != is_null($player->place))
						{
							$place = $player->location->places()->whereId($newPlace)->first();

							if(empty($newPlace) || (isset($place) && $place->isAvailable()))
							{
								$player->location_place_id = $newPlace;
								$player->save();
							}
						}
						
						return redirect('game');
					}
					else
					{
						$place = $player->place;

						if(is_null($place) || !$place->isAvailable())
						{
							return redirect('game');
						}
						else
						{
							$place->loadComponents();

							if($request->has('action'))
							{
								return $place->action($request);
							}
							else
							{
								return $place->view();
							}
						}
					}

				}
			});

			Route::post('/reports/readAll', ['as' => 'reports.readAll', 'uses' => 'ReportsController@readAll']);
			Route::post('/reports/destroyAll', ['as' => 'reports.destroyAll', 'uses' => 'ReportsController@destroyAll']);
			Route::resource('/reports', 'ReportsController', ['only' => ['index', 'show', 'destroy']]);

			Route::get('/premiumShop', ['as' => 'premiumShop', function()
			{
				return view('premiumshop');
			}]);


		});

	});
});
















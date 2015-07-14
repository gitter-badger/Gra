<?php

namespace HempEmpire\Components;
use HempEmpire\Player;
use HempEmpire\Shop as ShopModel;
use HempEmpire\TemplateShop as TemplateModel;

use DB;
use Request;
use Config;
use Illuminate\Pagination\LengthAwarePaginator;

class Shop extends Component
{
	private $shop;



	public function init()
	{
		$name = $this->getProperty('name');
		$delivery = $this->getProperty('delivery');

		$template = TemplateModel::whereName($name)->select('id')->firstOrFail();


		$this->shop = ShopModel::firstOrCreate([

			'template_id' => $template->id,
			'player_id' => $this->player->id,
			'location_place_id' => $this->getPlaceId(),
		]);


		if((!is_null($delivery) || is_null($this->shop->lastVisited)) && (is_null($this->shop->lastVisited) || ($this->shop->lastVisited + $delivery) < time()))
		{
			DB::transaction(function() use($template)
			{
				$this->shop->deleteItems();

				$deliveries = $template->deliveries()->with('item')->get();

				foreach($deliveries as $delivery)
				{
					if(!$this->shop->giveItem($delivery->item, $delivery->count))
					{
						if(Config::get('app.debug', false))
						{
							dd($delivery);
						}
						else
						{
							return false;
						}
					}
				}

				$this->shop->lastVisited = time();
				return $this->shop->save();
			});
		}
	}

	private function paginate($array, $view, $perPage = 16)
	{
		return collection_paginate($array, $perPage)
			->addQuery('view', $view);
	}



	public function view()
	{
		$view = Request::input('view', null);
		$items = [];

		$weapons = $this->shop->getUniqueWeaponsCount();
		$armors = $this->shop->getUniqueArmorsCount();
		$foods = $this->shop->getUniqueFoodsCount();
		$vehicles = $this->shop->getUniqueVehiclesCount();
		$seeds = $this->shop->getUniqueSeedsCount();
		$stuffs = $this->shop->getUniqueStuffsCount();
		$all = $weapons + $armors + $foods + $vehicles + $seeds + $stuffs;



		if($view === 'weapons' && $weapons > 0)
		{
			$items = $this->shop->getWeapons();
		}
		elseif($view === 'armors' && $armors > 0)
		{
			$items = $this->shop->getArmors();
		}
		elseif($view === 'foods' && $foods > 0)
		{
			$items = $this->shop->getFoods();
		}
		elseif($view === 'vehicles' && $vehicles > 0)
		{
			$items = $this->shop->getVehicles();
		}
		elseif($view === 'seeds' && $seeds > 0)
		{
			$items = $this->shop->getSeeds();
		}
		elseif($view === 'stuffs' && $stuffs > 0)
		{
			$items = $this->shop->getStuffs();
		}
		else
		{
			$view = 'items';
			$items = $this->shop->getItems();
		}

		if(count($items) == 0 && $view != 'items')
		{
			$view = 'items';
			$items = $this->shop->getItems();
		}

		$delivery = $this->getProperty('delivery');
		$lastUpdate = null;
		$nextUpdate = null;

		if(!is_null($delivery))
		{
			$lastUpdate = $this->shop->lastVisited;
			$nextUpdate = $lastUpdate + $delivery;
		}





		return view('component.shop')
			->with('view', $view)
			->with('all', $all)
			->with('weapons', $weapons)
			->with('armors', $armors)
			->with('foods', $foods)
			->with('vehicles', $vehicles)
			->with('seeds', $seeds)
			->with('stuffs', $stuffs)
			->with('items', $this->paginate($items, $view))
			->with('lastUpdate', $lastUpdate)
			->with('nextUpdate', $nextUpdate);
	}

	public function actionBuy($request)
	{
		$id = $request->input('item');
		$type = $request->input('type');
		$count = $request->input('count', 1);

		$item = $this->shop->findItemById($type, $id);


		if(is_null($item))
		{
			$this->danger('invalidItem');
		}
		elseif($count < 1 || $count > $item->getCount())
		{
			$this->danger('wrongQuantity');
		}
		else
		{
			$price = $item->getPrice() * $count;
			$premium = $item->isPremium();


			if($premium)
			{
				if($this->player->premiumPoints < $price)
				{
					$this->danger('notEnoughPremiumPoints')
						->with('value', $price);
					return;
				}
				else
				{
					$this->player->premiumPoints -= $price;
				}
			}
			else
			{
				if($this->player->money < $price)
				{
					$this->danger('notEnoughMoney')
						->with('value', $price);
					return;
				}
				else
				{
					$this->player->money -= $price;
				}
			}




			$success = DB::transaction(function() use($item, $count)
			{
				return $this->player->giveItem($item, $count) &&
					$this->shop->takeItem($item, $count) &&
					$this->player->save();
			});

			if($success)
			{
				$item->onBuy($this->player);

				$this->success('itemBought')
					->with('item', $item->getTitle())
					->with('count', $count);
			}
			else
			{
				$this->danger('unknown');
			}
		}
	}
}
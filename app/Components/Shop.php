<?php

namespace HempEmpire\Components;
use HempEmpire\Player;
use HempEmpire\Shop as ShopModel;
use HempEmpire\TemplateShop as TemplateModel;

use DB;
use Request;
use Config;
use Event;
use HempEmpire\Events\ItemBought;
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
			$this->delivery($template);
		}
	}

	private function delivery($template = null)
	{
		if(is_null($template))
			$template = $this->shop->template;

		return DB::transaction(function() use($template)
		{
			$this->shop->deleteItems();

			$deliveries = $template->deliveries()->with('item')->get();
			$count = $this->getProperty('items', count($deliveries));


			while($count > 0 && count($deliveries) > 0)
			{
				$count--;
				$index = mt_rand(0, count($deliveries) - 1);
				$delivery = $deliveries[$index];
				$deliveries->pull($index);
				$deliveries = $deliveries->values();

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
			->with('nextUpdate', $nextUpdate)
			->with('resetable', $this->getProperty('resetable', false))
			->with('resetCost', $this->getProperty('resetCost'))
			->with('lastReset', $this->shop->lastReseted)
			->with('nextReset', $this->shop->lastReseted + $this->getProperty('resetCooldown'));
	}

	public function actionBuy($request)
	{

		$id = $request->input('item');
		$type = $request->input('type');
		$count = $request->input('count', 1);

		$item = $this->shop->findItemById($type, $id);
		$space = $this->player->capacity - $this->player->weight;



		if(is_null($item))
		{
			$this->danger('invalidItem');
		}
		elseif($count < 1 || $count > $item->getCount())
		{
			$this->danger('wrongQuantity');
		}
		elseif($count * $item->getWeight() > $space)
		{
			$this->danger('notEnoughSpace');
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
				Event::fire(new ItemBought($this->player, $item, $count));

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



	public function actionReset()
	{
		$cost = $this->getProperty('resetCost');
		$next = $this->shop->lastReseted + $this->getProperty('resetCooldown');

		//dd($this->shop, date('Y-m-d H:i:s', $next), date('Y-m-d H:i:s'));

		if($this->player->premiumPoints < $cost)
		{
			$this->danger('notEnoughPremiumPoints')
				->with('value', $cost);
		}
		elseif(!is_null($this->shop->lastReseted) && $next > time())
		{
			$this->danger('cantResetYet');
		}
		else
		{
			$this->shop->lastReseted = time();
			$this->player->user->premiumPoints -= $cost;


			$success = DB::transaction(function()
			{
				return $this->player->user->save() && $this->delivery();
			});

			if($success)
			{
				$this->success('shopReseted');
			}
			else
			{
				$this->danger('saveError');
			}
		}


	}
}
<?php

namespace HempEmpire\Components;
use HempEmpire\Store as StoreModel;
use Request;
use DB;


use Illuminate\Pagination\LengthAwarePaginator;


class Store extends Component
{
	private $store;


	public function init()
	{
		$this->store = StoreModel::firstOrNew([

			'location_place_id' => $this->getPlaceId(),
			'player_id' => $this->player->id,
		]);

		if(!$this->store->exists)
		{
			$this->store->level = 0;
			$this->store->premiumLevel = 0;
			$this->store->capacity = $this->getProperty('baseCapacity');
			$this->store->save();
		}
	}

	private function paginate($array, $view, $perPage = 16)
	{
		return collection_paginate($array, $perPage)
			->addQuery('view', $view);
	}

	private function getAllowedTypes()
	{
		$types = [];

		$allow = explode(',', $this->getProperty('allow', 'weapon,armor,food,vehicle,stuff,seed'));
		$deny = explode(',', $this->getProperty('deny', ''));

		foreach($allow as $type)
			$types[] = trim($type);

		foreach($deny as $type)
		{
			$type = trim($type);
			if(($key = array_search($type, $types)) !== false)
				unset($types[$key]);
		}


		return $types;
	}

	private function getItems($owner, $view, $perPage = 16)
	{
		$types = $this->getAllowedTypes();
		$items = collect([]);


		foreach($types as $type)
		{
			$current = collect([]);

			switch($type)
			{
				case 'weapon':
					$current = $owner->getWeapons();
					break;

				case 'armor':
					$current = $owner->getArmors();
					break;

				case 'food':
					$current = $owner->getFoods();
					break;

				case 'stuff':
					$current = $owner->getStuffs();
					break;

				case 'seed':
					$current = $owner->getSeeds();
					break;

				case 'vehicle':
					$current = $owner->getVehicles();
					break;
			}

			$items = collection_join($items, $current);
		}

		return $this->paginate($items, $view, $perPage);
	}

	private function isAllowedType($type)
	{
		$types = $this->getAllowedTypes();
		return array_search($type, $types) !== false;
	}

	private function getExpandPrice()
	{
		return $this->getProperty('levelBasePrice') + $this->getProperty('levelPrice') * $this->store->level;
	}

	private function getPremiumExpandPrice()
	{
		return $this->getProperty('premiumLevelBasePrice') + $this->getProperty('premiumLevelPrice') * $this->store->premiumLevel;
	}


	public function view()
	{
		$view = Request::input('view', 'take');

		if($view != 'take' && $view != 'put')
			$view = 'take';

		if($view == 'take')
		{
			$items = $this->getItems($this->store, $view);

			return view('component.store')
				->with('weight', $this->store->getWeight())
				->with('capacity', $this->store->getCapacity())
				->with('normalPrice', $this->getExpandPrice())
				->with('premiumPrice', $this->getPremiumExpandPrice())
				->with('view', $view)
				->with('items', $items);
		}
		elseif($view == 'put')
		{
			$items = $this->getItems($this->player, $view);

			return view('component.store')
				->with('weight', $this->store->getWeight())
				->with('capacity', $this->store->getCapacity())
				->with('normalPrice', $this->getExpandPrice())
				->with('premiumPrice', $this->getPremiumExpandPrice())
				->with('view', $view)
				->with('items', $items);
		}
	}

	public function actionPut($request)
	{

		$id = $request->input('item');
		$type = $request->input('type');
		$count = $request->input('count', 1);
		$space = $this->store->getCapacity() - $this->store->getWeight();

		$item = $this->player->findItemById($type, $id);


		if(is_null($item))
		{
			$this->danger('invalidItem');
		}
		elseif(!$this->isAllowedType($type))
		{
			$this->danger('cantPut')
				->with('type', trans('item.types.' . $type));

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
			$success = DB::transaction(function() use($item, $count)
			{
				return $this->player->takeItem($item, $count) &&
					$this->store->giveItem($item, $count);
			});

			if($success)
			{
				$this->success('itemPut')
					->with('item', $item->getName())
					->with('count', $count);
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

	public function actionTake($request)
	{
		$id = $request->input('item');
		$type = $request->input('type');
		$count = $request->input('count', 1);

		$item = $this->store->findItemById($type, $id);


		if(is_null($item))
		{
			$this->danger('invalidItem');
		}
		elseif(!$this->isAllowedType($type))
		{
			$this->danger('cantTake')
				->with('type', trans('item.types.' . $type));
		}
		elseif($count < 1 || $count > $item->getCount())
		{
			$this->danger('wrongQuantity');
		}
		elseif($count * $item->getWeight() < $space)
		{
			$this->danger('notEnoughSpace');
		}
		else
		{
			$success = DB::transaction(function() use($item, $count)
			{
				return $this->store->takeItem($item, $count) &&
					$this->player->giveItem($item, $count);
			});

			if($success)
			{
				$this->success('itemTake')
					->with('item', $item->getName())
					->with('count', $count);
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

	public function actionExpand($request)
	{
		$type = $request->input('type');

		if($type == 'normal')
		{
			if($this->player->money < $this->getExpandPrice())
			{
				$this->danger('notEnoughMoney')
					->with('value', $this->getExpandPrice());
			}
			else
			{
				$this->player->money -= $this->getExpandPrice();
				$this->store->level++;
				$this->store->capacity += $this->getProperty('capacityPerLevel');


				$success = DB::transaction(function()
				{
					return $this->player->save() && $this->store->save();
				});

				if($success)
				{
					$this->success('storeExpanded');
				}
				else
				{
					$this->danger('saveError');
				}

			}
		}
		elseif($type == 'premium')
		{
			if($this->player->user->premiumPoints < $this->getPremiumExpandPrice())
			{
				$this->danger('notEnoughPremiumPoints')
					->with('value', $this->getPremiumExpandPrice());
			}
			else
			{
				$this->player->user->premiumPoints -= $this->getPremiumExpandPrice();
				$this->store->premiumLevel++;
				$this->store->capacity += $this->getProperty('capacityPerPremiumLevel');


				$success = DB::transaction(function()
				{
					return $this->player->user->save() && $this->store->save();
				});

				if($success)
				{
					$this->success('storeExpanded');
				}
				else
				{
					$this->danger('saveError');
				}

			}
		}
	}
}
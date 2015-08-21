<?php

namespace HempEmpire\Components;
use HempEmpire\Market as MarketModel;
use HempEmpire\MarketItem as ItemModel;
use Request;
use DB;
use TransText;


class Market extends Component
{
	private $market;


	public function init()
	{
		$this->market = MarketModel::firstOrCreate([

			'location_place_id' => $this->getPlaceId(),
			'world_id' => $this->player->world->id,
		]);
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

	private function getPlayerItems($view, $perPage = 16)
	{
		$types = $this->getAllowedTypes();
		$items = collect([]);


		foreach($types as $type)
		{
			$current = collect([]);

			switch($type)
			{
				case 'weapon':
					$current = $this->player->getWeapons();
					break;

				case 'armor':
					$current = $this->player->getArmors();
					break;

				case 'food':
					$current = $this->player->getFoods();
					break;

				case 'stuff':
					$current = $this->player->getStuffs();
					break;

				case 'seed':
					$current = $this->player->getSeeds();
					break;

				case 'vehicle':
					$current = $this->player->getVehicles();
					break;
			}

			$items = collection_join($items, $current);
		}

		return $this->paginate($items, $view, $perPage);
	}

	private function getMarketItems($view, $perPage = 16)
	{
		return $this->market->items()->where('player_id', '<>', $this->player->id)
			->paginate($perPage)->addQuery('view', $view);
	}

	private function isAllowedType($type)
	{
		$types = $this->getAllowedTypes();
		return array_search($type, $types) !== false;
	}

	public function view()
	{
		$view = Request::input('view', 'sell');

		if($view != 'sell' && $view != 'buy')
			$view = 'sell';

		if($view == 'sell')
		{
			return view('component.market')
				->with('view', $view)
				->with('minPrice', $this->getProperty('minPrice') / 100)
				->with('maxPrice', $this->getProperty('maxPrice') / 100)
				->with('items', $this->getPlayerItems($view));
		}
		elseif($view == 'buy')
		{
			return view('component.market')
				->with('view', $view)
				->with('items', $this->getMarketItems($view));
		}
	}


	public function actionBuy()
	{
		$itemId = Request::input('item');
		$item = $this->market->items()->whereId($itemId)->first();
		$space = $this->player->capacity - $this->player->weight;

		if(is_null($item))
		{
			$this->danger('wrongItem');
		}
		elseif($item->getCount() * $item->getWeight() > $space)
		{
			$this->danger('notEnoughSpace');
		}
		else
		{
			$count = $item->getCount();
			$price = $item->getCount() * $item->getPrice();
			$priceText = null;

			
			if($item->isPremium())
			{
				if($this->player->premiumPoints < $price)
				{
					$this->danger('notEnoughPremiumPoints')
						->with('value', $price);
					return;
				}
				else
				{
					$priceText = $price . 'pp';
					$this->player->premiumPoints -= $price;
					$item->player->premiumPoints += $price;
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
					$item->player->money += $price;
				}
			}


			$success = DB::transaction(function() use($item)
			{
				if(!$item->player->save())
					return false;

				if(!$this->player->save())
					return false;

				if(!$this->player->giveItem($item->item, $item->getCount()))
					return false;

				$item->item()->delete();
				$item->delete();

				return true;
			});

			if($success)
			{
				$item->onBuy($this->player);
				
				$this->success('itemBought')
					->with('item', $item->getTitle())
					->with('count', $item->getCount());

				$item->player->newReport('market-bought')
					->param('item', new TransText('item.' . $item->getName() . '.name'))
					->param('count', $count)
					->param('price', $item->isPremium() ? $price . 'pp' : '$' . $price)->send();
			}


		}
	}

	public function actionSell()
	{
		$itemId = Request::input('item');
		$itemType = Request::input('type');
		$count = Request::input('count');
		$price = Request::input('price');

		$item = $this->player->findItemById($itemType, $itemId);


		if(is_null($item))
		{
			$this->danger('wrongItem');
		}
		elseif(!$this->isAllowedType($itemType))
		{
			$this->danger('wrongType');
		}
		elseif($price > round($item->getPrice() * $this->getProperty('maxPrice') / 100) ||
			$price < round($item->getPrice() * $this->getProperty('minPrice')) / 100)
		{
			$this->danger('wrongPrice');
		}
		elseif($count > $item->getCount() || $count < 1)
		{
			$this->danger('wrongCount');
		}
		else
		{
			$newItem = clone $item;
			$newItem->id = null;
			$newItem->exists = false;
			$newItem->count = $count;

			$marketItem = new ItemModel;
			$marketItem->market()->associate($this->market);
			$marketItem->player()->associate($this->player);
			$marketItem->price = $price;



			$success = DB::transaction(function() use($marketItem, $newItem, $item, $count)
			{
				if(!$this->player->takeItem($item, $count))
					return false;

				if(!$newItem->save())
					return false;

				$marketItem->item()->associate($newItem);

				if(!$marketItem->save())
					return false;


				$newItem->owner()->associate($marketItem);

				if(!$newItem->save())
					return false;

				return true;
			});

			if($success)
			{
				$this->success('itemOfferedSold')
					->with('item', $item->getTitle())
					->with('count', $count);
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}
}
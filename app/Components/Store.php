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
		$this->store = StoreModel::firstOrCreate([

			'location_place_id' => $this->getPlaceId(),
			'player_id' => $this->player->id,
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


	public function view()
	{
		$view = Request::input('view', 'take');

		if($view != 'take' && $view != 'put')
			$view = 'take';

		if($view == 'take')
		{
			$items = $this->getItems($this->store, $view);

			return view('component.store')
				->with('view', $view)
				->with('items', $items);
		}
		elseif($view == 'put')
		{
			$items = $this->getItems($this->player, $view);

			return view('component.store')
				->with('view', $view)
				->with('items', $items);
		}
	}

	public function actionPut($request)
	{

		$id = $request->input('item');
		$type = $request->input('type');
		$count = $request->input('count', 1);

		$item = $this->player->findItemById($type, $id);


		if(is_null($item))
		{
			$this->error('invalidItem');
		}
		elseif(!$this->isAllowedType($type))
		{
			$this->error('cantPut')
				->with('type', trans('item.types.' . $type));

		}
		elseif($count < 1 || $count > $item->getCount())
		{
			$this->error('wrongQuantity');
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
				$this->error('unknown');
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
			$this->error('invalidItem');
		}
		elseif(!$this->isAllowedType($type))
		{
			$this->error('cantTake')
				->with('type', trans('item.types.' . $type));
		}
		elseif($count < 1 || $count > $item->getCount())
		{
			$this->error('wrongQuantity');
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
				$this->error('unknown');
			}
		}
	}
}
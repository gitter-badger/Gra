<?php
namespace HempEmpire\Http\Controllers\Player;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\Player;
use HempEmpire\World;
use HempEmpire\Location;

use Illuminate\Http\Request;
use Config;
use Auth;
use DB;

class PlayerController extends Controller
{
	public function __construct()
	{
		$this->middleware('player', ['except' => ['getCreate', 'postCreate']]);
	}

	public function getIndex()
	{
		return redirect(route('player.statistics'));
	}


	public function getCreate()
	{
		return view('player.create')
			->with('points', Config::get('player.start.stats'));
	}

	public function postCreate(Request $request)
	{
		$user = Auth::user();
		$world = World::getSelected();

		$this->validate($request, [

			'name' => 'unique:players,name,NULL,id,world_id,' . $world->id . '|alpha_num|required|between:4,32',
			'strength' => 'required|integer|min:0',
			'perception' => 'required|integer|min:0',
			'endurance' => 'required|integer|min:0',
			'charisma' => 'required|integer|min:0',
			'intelligence' => 'required|integer|min:0',
			'agility' => 'required|integer|min:0',
		]);

		$points = Config::get('player.start.stats');

		$points -= $request->input('strength')
			+ $request->input('perception')
			+ $request->input('endurance')
			+ $request->input('charisma')
			+ $request->input('intelligence')
			+ $request->input('agility');

		if($points != 0)
		{
			return redirect()->back()
				->withInput($request->all())
				->withErrors(['points' => trans('error.wrongStatistics')]);
		}
		else
		{
			$player = new Player;
			$player->user_id = $user->id;
			$player->world_id = $world->id;
			$player->location_id = Location::getStartLocation()->id;


			$player->name = $request->input('name');
			$player->strength = $request->input('strength');
			$player->perception = $request->input('perception');
			$player->endurance = $request->input('endurance');
			$player->charisma = $request->input('charisma');
			$player->intelligence = $request->input('intelligence');
			$player->agility = $request->input('agility');

			$player->save();

			return redirect(route('game'));
		}
	}

	public function getStatistics()
	{
		return view('player.statistics');
	}

	public function postStatistics(Request $request)
	{
		$player = Player::getActive();

		$this->validate($request, [

			'strength' => 'required|integer|min:' . $player->strength,
			'perception' => 'required|integer|min:' . $player->perception,
			'endurance' => 'required|integer|min:' . $player->endurance,
			'charisma' => 'required|integer|min:' . $player->charisma,
			'intelligence' => 'required|integer|min:' . $player->intelligence,
			'agility' => 'required|integer|min:' . $player->agility,
		]);

		$strength = $request->input('strength') - $player->strength;
		$perception = $request->input('perception') - $player->perception;
		$endurance = $request->input('endurance') - $player->endurance;
		$charisma = $request->input('charisma') - $player->charisma;
		$intelligence = $request->input('intelligence') - $player->intelligence;
		$agility = $request->input('agility') - $player->agility;

		$sum = $strength + $perception + $endurance + $charisma + $intelligence + $agility;

		if($sum > $player->statisticPoints)
		{
			return redirect()->back()
				->withInput($request->all())
				->withErrors(['points' => trans('error.wrongStatistics')]);
		}
		else
		{
			$player->statisticPoints -= $sum;
			$player->strength += $strength;
			$player->perception += $perception;
			$player->endurance += $endurance;
			$player->charisma += $charisma;
			$player->intelligence += $intelligence;
			$player->agility += $agility;

			if($player->save())
			{
				$this->success('playerUpdated');
			}
			else
			{
				$this->danger('saveError');
			}

			return redirect(route('player.statistics'));
		}
	}

	public function getItems()
	{
		$player = Player::getActive();
		$items = $player->getItems();

		$armor = $player->equipment->armors()->where('count', '>', 0)->first();
		$vehicle = $player->equipment->vehicles()->where('count', '>', 0)->first();
		$weapon = $player->equipment->weapons()->where('count', '>', 0)->first();

		return view('player.items')
			->with('armor', $armor)
			->with('vehicle', $vehicle)
			->with('weapon', $weapon)
			->with('items', $items);
	}

	public function postItems(Request $request)
	{
		$player = Player::getActive();
		$id = $request->input('item');
		$type = $request->input('type');

		$item = $player->findItemById($type, $id);

		if(!$item->isUsable())
		{
			$this->danger('itemIsNotUsable')
				->with('name', $item->getTitle());
		}
		elseif($player->isBusy)
		{
			$this->danger('characterIsBusy');
		}
		else
		{
			$success = DB::transaction(function() use($player, $item)
			{
				if(!$item->onUse($player))
					return false;

				return $player->takeItem($item, 1);
			});

			if($success)
			{
				$this->success('itemUsed')
					->with('name', $item->getTitle());
			}
			else
			{
				$this->danger('saveError');
			}
		}

		return redirect(route('player.items'));
	}

}
<?php

namespace HempEmpire\Components;
use HempEmpire\World;
use HempEmpire\Player;
use HempEmpire\Jobs\Battle;
use Config;
use Request;

class Attack extends Component
{

	public function view()
	{
		$world = $this->player->world;
		$diff = $this->getProperty('levelDiff');

		$minLevel = max($this->player->level - $diff, $this->getProperty('minLevel'));
		$maxLevel = $this->player->level + $diff;


		$characters = $world->players()->whereBetween('level', [$minLevel, $maxLevel])->where('id', '<>', $this->player->id)
			->where('jobEnd', '<=', time())->where('location_id', '=', $this->player->location_id)->paginate(25);


		return view('component.attack')
			->with('characters', $characters);
	}



	public function actionAttack()
	{
		$character = Player::find(Request::input('character'));
		$energy = Config::get('player.attacking.energy');
		$duration = Config::get('player.attacking.duration');

		if($this->player->energy <= $energy)
		{
			$this->danger('notEnoughEnergy')
				->with('value', $energy);
		}
		elseif(is_null($character))
		{
			$this->danger('playerDoesNotExists');
		}
		elseif($this->player->id == $character->id)
		{
			$this->danger('cannotAttackYourself');
		}
		elseif($this->player->location_id != $character->location_id || $character->jobEnd > time())
		{
			$this->danger('playerRunAway');
		}
		else
		{
			$this->player->energy -= $energy;
			$this->player->startAttacking($duration, false);

			if(Config::get('app.debug', false))
				$duration /= 60;

			$battle = new Battle;
			$battle->joinRed($this->player);
			$battle->joinBlue($character);
			$battle->reason('red', trans('attack.attacker', ['name' => $character->name]));
			$battle->reason('blue', trans('attack.defender', ['name' => $this->player->name]));
			$battle->delay($duration);

			if($this->player->save())
			{
				$this->dispatch($battle);
				$this->success('attackStarted');
			}
			else
			{
				$this->danger('saveError');
			}

		}
	}
}
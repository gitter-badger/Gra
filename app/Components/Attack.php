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

		$threshold = $this->getProperty('threshold');

		$minLevel = $this->getProperty('minLevel');
		$minRespect = $this->player->respect * (100 - $threshold) / 100;
		$maxRespect = $this->player->respect * (100 + $threshold) / 100;




		$characters = $world->players()->whereBetween('respect', [$minRespect, $maxRespect])->where('id', '<>', $this->player->id)
			->where('level', '>=', $minLevel)->where('jobEnd', '<=', time())->where('location_id', '=', $this->player->location_id)->paginate(25);


		return view('component.attack')
			->with('characters', $characters);
	}



	public function actionAttack()
	{
		$character = Player::find(Request::input('character'));
		$energy = Config::get('player.attacking.energy');
		$duration = Config::get('player.attacking.duration');
		$minLevel = $this->getProperty('minLevel');
		$threshold = $this->getProperty('threshold');
		$minRespect = $this->player->respect * (100 - $threshold) / 100;
		$maxRespect = $this->player->respect * (100 + $threshold) / 100;

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
		elseif($character->level < $minLevel || $character->respect < $minRespect || $character->respect > $maxRespect)
		{
			$this->danger('cannotAttackPlayer');
		}
		else
		{
			$duration = round($duration * $this->player->world->timeScale);

			$this->player->energy -= $energy;
			$this->player->startAttacking($duration, false);

			$battle = new Battle;
			$battle->joinRed($this->player);
			$battle->joinBlue($character);
			$battle->reason('red', trans('attack.attacker', ['name' => $character->name]));
			$battle->reason('blue', trans('attack.defender', ['name' => $this->player->name]));

			
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
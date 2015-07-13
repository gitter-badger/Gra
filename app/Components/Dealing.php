<?php


namespace HempEmpire\Components;
use HempEmpire\Jobs\Deal;
use Request;
use Config;


class Dealing extends Component
{
	public function view()
	{
		return view('component.dealing')
			->with('energy', $this->getProperty('energy'))
			->with('minDuration', $this->getProperty('durationMin'))
			->with('maxDuration', $this->getProperty('durationMax'));
	}



	public function actionDeal()
	{
		$duration = Request::input('duration');
		$energy = $duration * $this->getProperty('energy');


		if($duration < $this->getProperty('durationMin') ||
			$duration > $this->getProperty('durationMax'))
		{
			$this->danger('wrongDuration');
		}
		elseif($this->player->energy < $energy)
		{
			$this->danger('notEnoughEnergy')
				->with('value', $energy);
		}
		else
		{
			$duration *= 3600;

			if(Config::get('app.debug', false))
			{
				$duration /= 60;
			}

			$this->player->energy -= $energy;

			


			if($this->player->startDealing($duration))
			{
				$minInterval = $this->getProperty('minInterval');
				$maxInterval = $this->getProperty('maxInterval');
				$minStuff = $this->getProperty('minStuff');
				$maxStuff = $this->getProperty('maxStuff');
				$burnChance = $this->getProperty('burnChance');

				if(Config::get('app.debug', false))
				{
					$minInterval /= 60;
					$maxInterval /= 60;
				}

				$deal = new Deal($this->player, $minInterval, $maxInterval, $minStuff, $maxStuff, $burnChance);

				$this->dispatch($deal);

				$this->success('dealingStarted');
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}
}
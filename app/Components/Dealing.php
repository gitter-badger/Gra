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
			$now = time();
			$duration *= 3600;

			if(Config::get('app.debug', false))
			{
				$duration /= 60;
			}


			$this->player->energy -= $energy;
			$this->player->jobName = 'dealing';
			$this->player->jobStart = $now;
			$this->player->jobEnd = $now + $duration;
			$this->player->energyUpdate = $now + $duration;

			if($this->player->save())
			{
				$minInterval = $this->getProperty('minInterval');
				$maxInterval = $this->getProperty('maxInterval');
				$minStuff = $this->getProperty('minStuff');
				$maxStuff = $this->getProperty('maxStuff');

				if(Config::get('app.debug', false))
				{
					$minInterval /= 60;
					$maxInterval /= 60;
				}

				$deal = new Deal($this->player, $minInterval, $maxInterval, $minStuff, $maxStuff);

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
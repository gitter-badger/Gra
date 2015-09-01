<?php


namespace HempEmpire\Components;
use HempEmpire\Jobs\Deal;
use Request;
use Config;


class Dealing extends Component
{
	protected function getEnergy()
	{
		$energy = $this->getProperty('energy');

		if($this->player->hasTalent('dealing-energy'))
		{
			return round($energy / 2);
		}
		else
		{
			return $energy;
		}
	}


	public function view()
	{

		return view('component.dealing')
			->with('count', $this->player->getStuffsCount())
			->with('energy', $this->getEnergy())
			->with('minDuration', $this->getProperty('durationMin'))
			->with('maxDuration', $this->getProperty('durationMax'))
			->with('minPrice', $this->getProperty('minPrice'))
			->with('maxPrice', $this->getProperty('maxPrice'));
	}



	public function actionDeal()
	{
		$duration = Request::input('duration');
		$price = round(Request::input('price'));
		$energy = $duration * $this->getEnergy();
		$minPrice = $this->getProperty('minPrice');
		$maxPrice = $this->getProperty('maxPrice');

		if($duration < $this->getProperty('durationMin') ||
			$duration > $this->getProperty('durationMax'))
		{
			$this->danger('wrongDuration');
		}
		elseif($price < $minPrice || $price > $maxPrice)
		{
			$this->danger('wrongPrice');
		}
		elseif($this->player->energy < $energy)
		{
			$this->danger('notEnoughEnergy')
				->with('value', $energy);
		}
		else
		{
			$duration *= 600;

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
				$beatChance = $this->getProperty('beatChance');
				$priceFactor = 1.5 - ($price - $minPrice) / ($maxPrice - $minPrice);
				

				if(Config::get('app.debug', false))
				{
					$minInterval /= 60;
					$maxInterval /= 60;
				}

				$deal = new Deal($this->player, $minInterval, $maxInterval, $minStuff, $maxStuff,
					$price, $priceFactor, $burnChance, $beatChance);

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
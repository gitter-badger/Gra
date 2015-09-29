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

	protected function getStuffs()
	{
		return $this->player->getStuffs();
	}

	protected function getMinPrice()
	{
		return $this->getProperty('minPrice');
	}

	protected function getMaxPrice()
	{
		return $this->getProperty('maxPrice');
	}

	protected function getDuration()
	{
		return round(15 * 60 * $this->player->world->timeScale);
	}

	protected function getMinInterval()
	{
		return floor($this->getDuration() / $this->getProperty('maxClients'));
	}

	protected function getMaxInterval()
	{
		return ceil($this->getDuration() / $this->getProperty('minClients'));
	}

	protected function getBurnChance()
	{
		return $this->GetProperty('burnChance');
	}





	public function view()
	{

		return view('component.dealing')
			->with('stuffs', $this->getStuffs())
			->with('minPrice', $this->getMinPrice())
			->with('maxPrice', $this->getMaxPrice())
			->with('duration', $this->getDuration())
			->with('energy', $this->getEnergy());
	}



	public function actionDeal($request)
	{
		$stuffs = $request->input('stuff');
		$job = new Deal($this->player, $this->getMinInterval(), $this->getMaxInterval(),
			$this->getMinPrice(), $this->getMaxPrice(), $this->getBurnChance());

		

		if($this->player->energy < $this->getEnergy())
		{
			$this->danger('notEnoughEnergy')
				->with('value', $this->getEnergy());
		}
		else
		{
			foreach($stuffs as $id => $data)
			{
				$stuff = $this->player->stuffs()->whereId($id)->first();

				if(!is_null($stuff) && $data['sell'])
				{
					$job->add($id, $data['price'], min($data['count'], $stuff->getCount()));
				}
			}

			$this->player->energy -= $this->getEnergy();

			if($this->player->startDealing($this->getDuration()))
			{
				$job->delay($this->getMinInterval());
				$this->dispatch($job);
				$this->success('dealingStarted');
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}
}
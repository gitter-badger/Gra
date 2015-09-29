<?php 

namespace HempEmpire\Components;
use Request;
use Config;


class Hospital extends Component
{
	protected function getNormalSpeed()
	{
		return round($this->getProperty('normalSpeed') * $this->player->world->timeScale);
	}

	protected function getNormalPrice()
	{
		return $this->getProperty('normalPrice') * $this->player->level;
	}

	protected function getNormalAvailable()
	{
		return $this->getProperty('normalAvailable');
	}

	protected function getFastSpeed()
	{
		return round($this->getProperty('fastSpeed') * $this->player->world->timeScale);
	}

	protected function getFastPrice()
	{
		return $this->getProperty('fastPrice') * $this->player->level;
	}

	protected function getFastAvailable()
	{
		return $this->getProperty('fastAvailable');
	}




	public function view()
	{
		return view('component.hospital')
			->with('normalSpeed', $this->getNormalSpeed())
			->with('normalPrice', $this->getNormalPrice())
			->with('normalAvailable', $this->getNormalAvailable())
			->with('fastSpeed', $this->getFastSpeed())
			->with('fastPrice', $this->getFastPrice())
			->with('fastAvailable', $this->getFastAvailable());
	}

	public function actionTreat()
	{
		$type = Request::input('treat');
		$health = Request::input('health');
		$speed = null;
		$price = null;


		if($health < 1 || $health > ($this->player->maxHealth - $this->player->health))
		{
			$this->danger('wrongHealth');
			return;
		}
		else
		{
			if($type == 'normal' && $this->getNormalAvailable())
			{
				$speed = $this->getNormalSpeed();
				$price = $this->getNormalPrice();

			}
			elseif($type == 'fast' && $this->getFastAvailable())
			{
				$speed = $this->getFastSpeed();
				$price = $this->getFastPrice();
			}
			else
			{
				return;
			}
		}

		if($this->player->money < $price)
		{
			$this->danger('notEnoughMoney')
				->with('value', $price);
		}
		else
		{
			$duration = round($speed * $health * $this->player->world->timeScale);

			$this->player->money -= $price;
			$this->player->startHealing($duration, false, $type);

			if($this->player->save())
			{
				$this->success('treatmentStarted');
			}
			else
			{
				$this->danger('saveError');
			}
		}

	}
}
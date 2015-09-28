<?php 

namespace HempEmpire\Components;
use Request;
use Config;


class Hospital extends Component
{


	public function view()
	{
		return view('component.hospital')
			->with('normalSpeed', round($this->getProperty('normalSpeed') * $this->player->world->timeScale))
			->with('normalPrice', $this->getProperty('normalPrice') * $this->player->level)
			->with('fastSpeed', round($this->getProperty('fastSpeed') * $this->player->world->timeScale))
			->with('fastPrice', $this->getProperty('fastPrice') * $this->player->level);
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
			if($type == 'normal')
			{
				$speed = round($this->getProperty('normalSpeed') * $this->player->world->timeScale);
				$price = $this->getProperty('normalPrice');

			}
			elseif($type == 'fast')
			{
				$speed = round($this->getProperty('fastSpeed') * $this->player->world->timeScale);
				$price = $this->getProperty('fastPrice');
			}
			else
			{
				return;
			}

			$price *= $this->player->level;
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
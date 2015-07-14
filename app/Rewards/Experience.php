<?php

namespace HempEmpire\Rewards;
use HempEmpire\Contracts\Reward;
use HempEmpire\Player;


class Experience implements Reward
{
	private $experience;
	private $perLevel;

	protected function getFactor(Player $player = null)
	{	
		if($this->perLevel)
		{
			if(is_null($player))
				$player = Player::getActive();

			return $player->level;
		}
		else
		{
			return 1;
		}
	}

	public function __construct($experience, $perLevel = true)
	{
		$this->experience = $experience;
		$this->perLevel = $perLevel;
	}


	public function give(Player $player)
	{
		$player->experience += $this->experience * $this->getFactor($player);
	}

	public function getText()
	{
		$value = $this->experience;

		if($this->perLevel)
			$value .= ' * ' . trans('statistic.level');
		
		return trans('reward.experience', ['value' => $value]);
	}

	public function isVisible()
	{
		return true;
	}
}
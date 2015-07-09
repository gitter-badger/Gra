<?php

namespace HempEmpire\Rewards;
use HempEmpire\Contracts\Reward;
use HempEmpire\Player;

class Money implements Reward
{
	private $money;
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

	public function __construct($money, $perLevel = true)
	{
		$this->money = $money;
		$this->perLevel = $perLevel;
	}

	public function give(Player $player)
	{
		$player->money += $this->money * $this->getFactor($player);
	}

	public function getText()
	{
		$value = $this->money;

		if($this->perLevel)
			$value .= ' * ' . trans('player.level');
		
		return trans('reward.money', ['value' => $value]);
	}

	public function isVisible()
	{
		return true;
	}
}
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

			return (1 + $player->level / 10) * $player->moneyModifier;
		}
		else
		{
			if(is_null($player))
				$player = Player::getActive();

			return $player->moneyModifier;
		}
	}

	public function __construct($money, $perLevel = true)
	{
		$this->money = $money;
		$this->perLevel = $perLevel;
	}

	public function give(Player $player)
	{
		$player->money += round($this->money * $this->getFactor($player));
	}

	public function getText()
	{
		$value = '<span data-ng-bind="round(' . $this->money . ' * player.moneyModifier';

		if($this->perLevel)
			$value .= ' * (player.level / 10 + 1)';


		$value .= ')"></span>';
		
		return trans('reward.money', ['value' => $value]);
	}

	public function isVisible()
	{
		return true;
	}
}
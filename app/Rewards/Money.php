<?php

namespace HempEmpire\Rewards;
use HempEmpire\Player;

class Money extends Reward
{
	private $money;
	private $const;

	protected function getFactor(Player $player = null)
	{	
		if(!$this->const)
		{
			if(is_null($player))
				$player = Player::getActive();

			return ($player->level / 10 + 1) * $player->moneyModifier;
		}
		else
		{
			return 1;
		}
	}

	public function __construct($money, $const = 0)
	{
		$this->money = $money;
		$this->const = $const;
	}

	public function give(Player $player)
	{
		$money = round($this->money * $this->getFactor($player));

		$this->log('Giving ' . $money . ' money to ' . $player->name);


		$player->money += $money;
	}

	public function getText()
	{
		$value = '<span data-ng-bind="round(' . $this->money;

		if(!$this->const)
			$value .= ' * player.moneyModifier * (player.level / 10 + 1)';


		$value .= ')"></span>';
		
		return trans('reward.money', ['value' => $value]);
	}

	public function isVisible()
	{
		return $this->money > 0;
	}
}
<?php

namespace HempEmpire\Rewards;
use HempEmpire\Contracts\Reward;
use HempEmpire\Player;


class Dealer implements Reward
{
	private $experience;
	private $perLevel;

	protected function getFactor(Player $player = null)
	{	
		if($this->perLevel)
		{
			if(is_null($player))
				$player = Player::getActive();

			return ($player->level / 10) * $player->experienceModifier;
		}
		else
		{
			if(is_null($player))
				$player = Player::getActive();


			return $player->experienceModifier;
		}
	}

	public function __construct($experience, $perLevel = true)
	{
		$this->experience = $experience;
		$this->perLevel = $perLevel;
	}


	public function give(Player $player, $debug = false)
	{
		$experience = round($this->experience * $this->getFactor($player));

		if($debug)
		{
			echo 'Giving ' . $experience . ' dealer exp to ' . $player->name . PHP_EOL;
		}

		$player->dealerExperience += $experience;
	}

	public function getText()
	{
		$value = '<span data-ng-bind="round(' . $this->experience . ' * player.experienceModifier';

		if($this->perLevel)
			$value .= ' * player.level / 10';


		$value .= ')"></span>';

		return trans('reward.dealer', ['value' => $value]);
	}

	public function isVisible()
	{
		return true;
	}
}
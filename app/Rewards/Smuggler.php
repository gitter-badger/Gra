<?php

namespace HempEmpire\Rewards;
use HempEmpire\Player;


class Smuggler extends Reward
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


	public function give(Player $player)
	{
		$experience = round($this->experience * $this->getFactor($player));

		$this->log('Giving ' . $experience . ' to ' . $player->name);

		$player->smugglerExperience += $experience;
	}

	public function getText()
	{
		$value = '<span data-ng-bind="round(' . $this->experience . ' * player.experienceModifier';

		if($this->perLevel)
			$value .= ' * player.level / 10';


		$value .= ')"></span>';

		return trans('reward.smuggler', ['value' => $value]);
	}

	public function isVisible()
	{
		return true;
	}
}
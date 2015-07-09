<?php


namespace HempEmpire\Rewards;
use HempEmpire\Contracts\Reward;
use HempEmpire\Player;
use HempEmpire\Quest as QuestModel;


class Quest implements Reward
{
	private $name;

	public function __construct($name)
	{
		$this->name = $name;
	}

	public function give(Player $player)
	{
		return $player->completeQuest($this->name);
	}

	public function getText()
	{
		return trans('reward.complete', ['value' => trans('quest.' . $this->name . '.name')]);
	}

	public function isVisible()
	{
		return false;
	}
}
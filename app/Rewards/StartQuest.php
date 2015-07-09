<?php


namespace HempEmpire\Rewards;
use HempEmpire\Contracts\Reward;
use HempEmpire\Player;
use HempEmpire\Quest as QuestModel;


class StartQuest implements Reward
{
	private $name;

	public function __construct($name)
	{
		$this->name = $name;
	}

	public function give(Player $player)
	{
		return $player->startQuest($this->name);
	}

	public function getText()
	{
		return trans('reward.start', ['value' => trans('quest.' . $this->name . '.name')]);
	}

	public function isVisible()
	{
		return false;
	}
}
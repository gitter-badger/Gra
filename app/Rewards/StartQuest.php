<?php


namespace HempEmpire\Rewards;
use HempEmpire\Player;
use HempEmpire\Quest as QuestModel;


class StartQuest extends Reward
{
	private $name;

	public function __construct($name)
	{
		$this->name = $name;
	}

	public function give(Player $player, $debug = false)
	{
		$this->log('Player ' . $player->name . ' started quest ' . $this->name);
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
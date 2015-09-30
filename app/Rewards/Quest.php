<?php


namespace HempEmpire\Rewards;
use HempEmpire\Player;
use HempEmpire\Quest as QuestModel;


class Quest extends Reward
{
	private $name;

	public function __construct($name)
	{
		$this->name = $name;
	}

	public function give(Player $player)
	{
		$this->log('Player ' . $player->name . ' completed quest ' . $this->name);

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
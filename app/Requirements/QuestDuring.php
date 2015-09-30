<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;
use HempEmpire\Quest as QuestModel;


class QuestDuring extends Quest
{

	public function __construct($name)
	{
		parent::__construct($name);
	}

	public function check(Player $player)
	{
		$quest = $player->quests()->where('quest_id', '=', $this->id)->first();

		if(is_null($quest))
		{
			return false;
		}
		else
		{	
			return $quest->active || $quest->done;
		}	
	}

	public function getText()
	{
		return trans('requirement.questDuring', ['value' => trans('quest.' . $this->name . '.name')]);
	}
}
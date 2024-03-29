<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;
use HempEmpire\Quest as QuestModel;


class Quest implements Requirement
{
	protected $id;
	protected $name;


	public function __construct($name)
	{
		$quest = QuestModel::whereName($name)->first();


		if(isset($quest))
		{
			$this->id = $quest->id;
			$this->name = $quest->name;
		}
		else
		{
			$this->id = 0;
		}
	}


	public function check(Player $player)
	{
		return $player->quests()->where('quest_id', '=', $this->id)->where('done', '=', true)->count() > 0;
	}

	public function getText()
	{
		return trans('requirement.quest', ['value' => trans('quest.' . $this->name . '.name')]);
	}
}
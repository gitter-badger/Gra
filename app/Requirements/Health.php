<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Health implements Requirement
{
	private $value;
	private $percent;


	public function __construct($value, $percent = false)
	{
		$this->value = $value;
		$this->percent = $percent;
	}

	protected function getValue()
	{
		if($this->percent)
		{
			return round($player->maxHealth * $this->value / 100);
		}
		else
		{
			return $this->value;
		}
	}


	public function check(Player $player)
	{
		return $this->player->health >= $this->getValue();
	}

	public function getText()
	{
		return trans('requirement.health', ['value' => $this->getValue()]);
	}
}
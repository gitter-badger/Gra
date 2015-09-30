<?php

namespace HempEmpire\Objectives;
use HempEmpire\Player;
use Event;

class Money extends Objective
{
	protected $count;




	public function __construct($count)
	{
		$this->count = $count;
	}



	public function render()
	{
		return $this->renderProgress(trans('objective.money', ['value' => $this->count]), $this->player()->money, $this->count);
	}

	public function check()
	{
		return $this->player()->money >= $this->count;
	}
}
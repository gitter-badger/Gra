<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\WorkEnd;
use HempEmpire\Player;
use Event;

class WorkDone extends Objective
{
	protected $state;
	protected $count;
	protected $group;


	public function __construct($count, $group = null)
	{
		$this->state = 0;
		$this->count = $count;
		$this->group = $group;
	}



	public function render()
	{
		return $this->renderProgress(trans('objective.work', ['value' => $this->count]), $this->state, $this->count);
	}

	public function check()
	{
		return $this->state >= $this->count;
	}

	public function init()
	{
		$this->listen(WorkEnd::class, 'onEnd');
	}


	public function onEnd(WorkEnd $event)
	{
		if(is_null($this->group) || $event->work->group->name == $this->group)
		{
			$this->state++;
			$this->change();
		}
	}
}
<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\WorkEnd;
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
		Event::listen(WorkEnd::class, [$this, 'onEnd']);
	}


	public function onEnd(WorkEnd $end)
	{
		if((is_null($this->group) || $end->work->group->name == $this->group))
		{
			$this->state++;
			$this->change();
		}
	}
}
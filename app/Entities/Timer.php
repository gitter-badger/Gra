<?php

namespace HempEmpire\Entities;
use HempEmpire\Entities\Progress\Bar;
use HempEmpire\Entities\Progress\TimeLabel;


class Timer extends Progress
{
	public function __construct()
	{
		$this->addClass('progress')
			->addClass('progress-time');

		$this->bar = new Bar;
		$this->label = new TimeLabel;

		$this->bar->setNow(time());

		$this->append($this->bar)
			->append($this->label)
			->setReversed(true)
			->setReload(true);
	}

	public function setReload($value)
	{
		$this->bar->setReload($value);
		return $this;
	}

	public function getReload()
	{
		return $this->bar->getReload();
	}

	
	public function setStop($value)
	{
		$this->bar->setStop($value);
		return $this;
	}

	public function getStop()
	{
		return $this->bar->getStop();
	}
	
}

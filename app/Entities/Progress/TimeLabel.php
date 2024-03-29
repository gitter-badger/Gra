<?php

namespace HempEmpire\Entities\Progress;
use Formatter;

class TimeLabel extends Label
{
	public function __construct()
	{
		parent::__construct();
		$this->addClass('progress-label-time');
	}

	

	protected function updateContent()
	{
		$this->content = Formatter::time($this->max - $this->now);
	}
}

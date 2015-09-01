<?php

namespace HempEmpire\Objectives;
use HempEmpire\Contracts\Objective as ObjectiveContract;
use Illuminate\Queue\SerializesModels;
use BootForm;



abstract class Objective implements ObjectiveContract
{
	use SerializesModels;
	private $_changed = false;


	protected function renderProgress($label, $state, $max)
	{
		$progress = entity('progress')
			->min(0)
			->now(min($state, $max))
			->max($max);

		return BootForm::staticInput('<strong>' . $label . '</strong>')->value($progress);
	}



	public function changed()
	{
		return $this->_changed;
	}


	protected function change()
	{
		$this->_changed = true;
	}
}
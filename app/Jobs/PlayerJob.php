<?php

namespace HempEmpire\Jobs;
use HempEmpire\Jobs\Job;
use HempEmpire\Player;


abstract class PlayerJob extends Job
{
	protected $player;



	public function __construct(Player $player)
	{
		$this->player = $player;
	}


	protected function before()
	{
		parent::before();

		foreach($this->player->quests as $quest)
			$quest->init();
	}

	protected function after()
	{
		foreach($this->player->quests as $quest)
			$quest->finit();

		parent::after();
	}



}
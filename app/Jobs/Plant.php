<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\PlayerJob;

use HempEmpire\Events\Plant as PlantEvent;
use Event;

use HempEmpire\Player;



class Plant extends PlayerJob
{
	private $slot;


	public function __construct(Player $player, PlantationSlot $slot)
	{
		parent::__construct($player);
		$this->slot = $slot;
	}


	protected function process()
	{
		Event::fire(new PlantEvent($this->player, $this->slot));
	}
}
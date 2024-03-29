<?php

namespace HempEmpire\Listeners;
use Illuminate\Foundation\Bus\DispatchesJobs;
use HempEmpire\Events\PlaceLeave;
use HempEmpire\Jobs\Battle;
use Debugbar;
use Config;
use TransText;


class Beat
{
    use DispatchesJobs;

	public function __construct()
	{

	}





	public function handle(PlaceLeave $event)
	{
		if(mt_rand(0, 100) < 5 && $event->place->location->is('city') && $event->player->level >= 10)
		{
			$job = new Battle();
			$job->joinBlue($event->player);
			$job->reason('blue', new TransText('battle.reason.attack'));
			$job->generateRed($event->player->level);

			$this->dispatch($job);
		}
	}


}
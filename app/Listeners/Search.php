<?php

namespace HempEmpire\Listeners;
use HempEmpire\Events\PlaceLeave;
use Debugbar;
use Config;


class Search
{

	public function __construct()
	{

	}





	public function handle(PlaceLeave $event)
	{
		if($event->player->roll(0, 100) < ($event->player->wanted * 15) && $event->place->location->is('city'))
		{
			$duration = $event->player->getStuffsCount() * 60;

			if(Config::get('app.debug', false))
			{
				$duration /= 60;
			}


			$event->player->wanted = 0;
			$event->player->startArrest($duration);
		}
	}


}
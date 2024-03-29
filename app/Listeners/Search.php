<?php

namespace HempEmpire\Listeners;
use HempEmpire\Events\PlaceLeave;
use HempEmpire\ReportDialog;
use Debugbar;
use Config;


class Search
{

	public function __construct()
	{

	}





	public function handle(PlaceLeave $event)
	{
		if($event->player->roll(0, 100) < ($event->player->wanted * 15) && $event->place->location->is('city') && $event->player->level >= 10)
		{
			$count = $event->player->getStuffsCount();

			if($count > 0)
			{
				$duration = $count * 60;

				if(Config::get('app.debug', false))
				{
					$duration /= 60;
				}


				$event->player->wanted = 0;
				$event->player->startArrest($duration);

				$dialog = new ReportDialog('search');
				$dialog->with('count', $count)
					->with('duration', time_to_duration($duration));

				$event->player->pushEvent($dialog);
			}
		}
	}


}
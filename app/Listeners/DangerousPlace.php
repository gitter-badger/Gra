<?php

namespace HempEmpire\Listeners;
use Illuminate\Foundation\Bus\DispatchesJobs;
use HempEmpire\Events\PlaceEnter;
use HempEmpire\Jobs\Battle;
use Debugbar;
use Config;
use TransText;
use DB;



class DangerousPlace
{

	public function __construct()
	{

	}





	public function handle(PlaceEnter $event)
	{
		if($event->place->isDangerous())
		{
			if(mt_rand(0, 100) >= 25)
			{
				$event->player->wantedUpdate = time();
				$event->player->wanted++;

				$report = $event->player->newReport('dangerous-place')
					->param('name', new TransText('place.' . $event->place->getName() . '.name'));

				DB::transaction(function() use($event, $report)
				{
					return $event->player->save() && $report->send();
				});
			}
		}
	}


}
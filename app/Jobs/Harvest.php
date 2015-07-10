<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;


use HempEmpire\Player;
use HempEmpire\TemplateStuff;
use HempEmpire\Stuff;
use DB;

use TransText;

class Harvest extends Job implements SelfHandling, ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

	private $player;
	private $species;
	private $quality;
	private $countMin;
	private $countMax;



	public function __construct(Player $player, $species, $quality, $countMin, $countMax)
	{
		$this->player = $player;
		$this->species = $species;
		$this->quality = $quality;
		$this->countMin = $countMin;
		$this->countMax = $countMax;
	}


	public function handle()
	{
		$count = $this->player->roll($this->countMin, $this->countMax);
		$template = TemplateStuff::where('name', '=', $this->species . '-stuff')->first();
		$stuff = new Stuff;

		$stuff->quality = $this->quality;
		$stuff->template()->associate($template);



		$this->player->plantatorExperience += $count;

		$success = DB::transaction(function() use($stuff, $count)
		{
			if($this->player->jobName == 'harvesting')
			{
				return $this->player->newReport('harvest')
					->param('name', new TransText('item.' . $stuff->getName() . '.name'))
					->param('count', $count)->send() && $this->player->giveItem($stuff, $count) && 
					$this->player->save();
			}
			else
			{
				return false;
			}
		});

		if($success)
			$this->player->completeQuest('first-plant');
		
		return $success;
	}
}
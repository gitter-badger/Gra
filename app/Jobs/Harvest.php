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
		$count = $this->player->roll($this->countMin, $this->countMax, 1);
		$template = TemplateStuff::where('name', '=', $this->species . '-stuff')->first();
		$stuff = new Stuff;

		$stuff->quality = $this->quality;
		$stuff->template()->associate($template);

		$this->player->completeQuest('first-plant');


		$this->player->plantatorExperience += $count;

		DB::transaction(function() use($stuff, $count)
		{
			return $this->player->save() &&
				$this->player->giveItem($stuff, $count);
		});

		return $this->player->newReport('harvest')
			->param('name', new TransText('item.' . $stuff->getName() . '.name'))
			->param('count', $count)->send();
	}
}
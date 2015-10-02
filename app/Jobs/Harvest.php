<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\PlayerJob;

use HempEmpire\Events\Harvest as HarvestEvent;
use Event;

use HempEmpire\Player;
use HempEmpire\TemplateStuff;
use HempEmpire\Stuff;
use DB;
use Config;

use TransText;

class Harvest extends PlayerJob
{
	private $species;
	private $quality;
	private $countMin;
	private $countMax;



	public function __construct(Player $player, $species, $quality, $countMin, $countMax)
	{
		parent::__construct($player);
		$this->species = $species;
		$this->quality = $quality;
		$this->countMin = $countMin;
		$this->countMax = $countMax;
	}


	protected function process()
	{
		$count = $this->player->roll($this->countMin, $this->countMax);
		$template = TemplateStuff::where('name', '=', $this->species . '-stuff')->first();
		$stuff = new Stuff;

		$stuff->quality = $this->quality;
		$stuff->template()->associate($template);

		$exp = $count;


		$this->log('Player ' . $this->player->name . ' harvested ' . $count . ' of stuff gaining ' . $exp . ' plantator experience');

		$this->player->plantatorExperience += $exp;

		$success = DB::transaction(function() use($stuff, $count)
		{
            if($this->player->hasTalent('plantator-points'))
                $this->player->givePremiumPoint();

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
		{
			Event::fire(new HarvestEvent($this->player, $this->species, $count));
		}

		return $success;
	}
}
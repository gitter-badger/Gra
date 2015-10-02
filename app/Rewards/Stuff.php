<?php

namespace HempEmpire\Rewards;
use HempEmpire\Player;

use HempEmpire\Stuff as StuffModel;
use HempEmpire\TemplateStuff;


class Stuff extends GiveItem
{
	private $quality;

	protected function findItemByName($name)
	{
		$item = TemplateStuff::whereName($name)->first();

		
		if(isset($item))
		{
			if(!is_null($this->quality))
			{
				$stuff = new StuffModel;

				$stuff->quality = $this->quality;
				$stuff->template()->associate($item);

				return $stuff;
			}

			return $item;
		}


		return null;
	}


	public function __construct($name, $count = 1, $quality = null)
	{
		parent::__construct($name, $count);
		$this->quality = $quality;
	}
}
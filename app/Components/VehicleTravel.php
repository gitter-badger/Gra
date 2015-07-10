<?php


namespace HempEmpire\Components;

class VehicleTravel extends Travel
{
	private $vehicle;


	public function init()
	{
		parent::init();


		$this->vehicle = $this->player->equipment->vehicles()->where('count', '>', 0)->first();
	}


	protected function getLocations()
	{
		if(isset($this->vehicle))
			return parent::getLocations();
		else 
			return [];
	}

	protected function findLocation($id)
	{
		if(isset($this->vehicle))
			return parent::findLocation($id);
		else
			return null;
	}




	protected function getSpeed()
	{
        $speedIncrease = (100 + $this->player->smugglerLevel * 5) / 100;
		return 1.0 / ($this->vehicle->getSpeed() * $speedIncrease);
	}

	protected function getCost()
	{
		return $this->vehicle->getCost();
	}

}
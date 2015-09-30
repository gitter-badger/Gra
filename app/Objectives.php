<?php

namespace HempEmpire;


class Objectives extends ClassContainer
{
	protected static $classes = [

		'buy' => \HempEmpire\Objectives\Buy::class,
		'work' => \HempEmpire\Objectives\WorkDone::class,
		'plant' => \HempEmpire\Objectives\Plant::class,
		'watering' => \HempEmpire\Objectives\Watering::class,
		'harvestPlant' => \HempEmpire\Objectives\HarvestPlant::class,
		'harvestStuff' => \HempEmpire\Objectives\HarvestStuff::class,
		'dealMoney' => \HempEmpire\Objectives\DealMoney::class,
		'dealCount' => \HempEmpire\Objectives\DealCount::class,
		'travelTo' => \HempEmpire\Objectives\TravelTo::class,
		'travelDistance' => \HempEmpire\Objectives\TravelDistance::class,
		'visit' => \HempEmpire\Objectives\Visit::class,
		'money' => \HempEmpire\Objectives\Money::class,
	];




	public function rawRender()
	{
		$buffer = '<ul class="list-group text-center">';

		if(count($this->objects) > 0)
		{
			foreach($this->objects as $object)
			{
				$buffer .= '<li class="list-group-item">' . class_basename(get_class($object)) . '</li>';
			}
		}
		else
		{
			$buffer .= '<li class="list-group-item text-muted">' . trans('objectives.none') . '</li>';
		}

		$buffer .= '</ul>';

		return $buffer;
	}
}
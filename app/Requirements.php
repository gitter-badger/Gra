<?php

namespace HempEmpire;
use HempEmpire\Contracts\Requirement;



class Requirements extends ClassContainer
{
	protected static $classes = [

		'level' => \HempEmpire\Requirements\Level::class,

		'plantator' => \HempEmpire\Requirements\Plantator::class,
		'smuggler' => \HempEmpire\Requirements\Smuggler::class,
		'dealer' => \HempEmpire\Requirements\Dealer::class,

		'~plantator' => \HempEmpire\Requirements\OtherPlantator::class,

		'health' => \HempEmpire\Requirements\Health::class,
		'energy' => \HempEmpire\Requirements\Energy::class,

		'strength' => \HempEmpire\Requirements\Strength::class,
		'perception' => \HempEmpire\Requirements\Perception::class,
		'endurance' => \HempEmpire\Requirements\Endurance::class,
		'charisma' => \HempEmpire\Requirements\Charisma::class,
		'intelligence' => \HempEmpire\Requirements\Intelligence::class,
		'agility' => \HempEmpire\Requirements\Agility::class,
		'luck' => \HempEmpire\Requirements\Luck::class,

		'quest' => \HempEmpire\Requirements\Quest::class,
		'during' => \HempEmpire\Requirements\QuestDuring::class,
		'equiped' => \HempEmpire\Requirements\Equiped::class,
		'gang' => \HempEmpire\Requirements\Gang::class,

		'notalent' => \HempEmpire\Requirements\NoTalent::class,
		'blocked' => \HempEmpire\Requirements\Blocked::class,
		'cartel' => \HempEmpire\Requirements\Cartel::class,
		'space' => \HempEmpire\Requirements\Space::class,
	];


	public function check(Player $player = null)
	{
		if(is_null($player))
		{
			$player = static::getDefaultPlayer();
		}

		foreach($this->objects as $object)
		{
			if($object->check($player) === false)
				return false;
		}
		
		return true;
	}

	public function render(Player $player = null)
	{
		if(is_null($player))
			$player = static::getDefaultPlayer();

		$buffer = '<ul class="list-group text-center">';

		foreach($this->objects as $object)
		{
			$class = null;
			$glyph = null;


			if($object->check($player))
			{
				$class = 'success';
				$glyph = 'ok';
			}
			else
			{
				$class = 'danger';
				$glyph = 'remove';
			}



			$buffer .= '<li class="list-group-item list-group-item-' . $class . '"><span class="glyphicon glyphicon-' . $glyph . '"></span>' . $object->getText() . '</li>';
		}

		$buffer .= '</ul>';

		return $buffer;
	}

	public function rawRender()
	{
		$buffer = '<ul class="list-group text-center">';

		if(count($this->objects) > 0)
		{
			foreach($this->objects as $object)
			{
				$buffer .= '<li class="list-group-item">' . $object->getText() . '</li>';
			}
		}
		else
		{
			$buffer .= '<li class="list-group-item text-muted">' . trans('requirement.none') . '</li>';
		}

		$buffer .= '</ul>';

		return $buffer;
	}
}
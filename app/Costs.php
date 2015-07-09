<?php

namespace HempEmpire;
use DB;

class Costs extends ClassContainer
{
	protected static $classes = [

		'energy' => \HempEmpire\Costs\Energy::class,
		'money' => \HempEmpire\Costs\Money::class,
	];


	public function canTake(Player $player = null)
	{
		if(is_null($player))
			$player = static::getDefaultPlayer();

		foreach($this->objects as $object)
		{
			if($object->canTake($player) === false)
				return false;
		}

		return true;
	}


	public function take(Player $player = null, $save = true)
	{
		if(is_null($player))
			$player = static::getDefaultPlayer();

		return DB::transaction(function() use($player, $save)
		{
			foreach($this->objects as $object)
			{
				if($object->take($player) === false)
					return false;
			}

			if($save)
			{
				return $player->save();
			}
			else
			{
				return true;
			}
		});
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


			if($object->canTake($player))
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
			$buffer .= '<li class="list-group-item text-muted">' . trans('cost.none') . '</li>';
		}

		$buffer .= '</ul>';

		return $buffer;
	}

}
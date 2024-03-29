<?php

namespace HempEmpire;
use DB;

class Rewards extends ClassContainer
{
	protected static $classes = [

		'money' => \HempEmpire\Rewards\Money::class,
		'experience' => \HempEmpire\Rewards\Experience::class,
		'complete' => \HempEmpire\Rewards\Quest::class,
		'start' => \HempEmpire\Rewards\StartQuest::class,
		'plantator' => \HempEmpire\Rewards\Plantator::class,
		'smuggler' => \HempEmpire\Rewards\Smuggler::class,
		'dealer' => \HempEmpire\Rewards\Dealer::class,
		'stuff' => \HempEmpire\Rewards\Stuff::class,
		'takeItem' => \HempEmpire\Rewards\TakeItem::class,
		'giveItem' => \HempEmpire\Rewards\GiveItem::class,
		'takeItemType' => \HempEmpire\Rewards\TakeItemType::class,
	];


	public function give(Player $player = null, $save = true)
	{
		if(is_null($player))
			$player = static::getDefaultPlayer();

		Debug::log('Giving rewards to ' . $player->name);

		return DB::transaction(function() use($player, $save)
		{
			foreach($this->objects as $object)
			{
				if($object->give($player) === false)
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
			if($object->isVisible())
				$buffer .= '<li class="list-group-item list-group-item-info">' . $object->getText() . '</li>';
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
			$buffer .= '<li class="list-group-item text-muted">' . trans('reward.none') . '</li>';
		}

		$buffer .= '</ul>';

		return $buffer;
	}
}
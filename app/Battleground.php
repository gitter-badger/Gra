<?php

class Battleground
{
	private $red = [];
	private $blue = [];
	private $queue;


	public function joinRed($character)
	{
		$this->red[] = ['red', $character];
	}

	public function joinBlue($character)
	{
		$this->blue[] = ['blue', $character];
	}

	protected function findRed($level)
	{
		$found = null;
		$diff = null;

		foreach($this->red as $record)
		{
			$character = $record[1];

			if($character->health > 0)
			{
				$d = abs($character->level - $level);

				if(is_null($diff) || $diff > $d)
				{
					$diff = $d;
					$found =  $character;
				}
			}
		}

		return $found;
	}

	protected function findBlue($level)
	{
		$found = null;
		$diff = null;

		foreach($this->blue as $record)
		{
			$character = $record[1];

			if($character->health > 0)
			{
				$d = abs($character->level - $level);

				if(is_null($diff) || $diff > $d)
				{
					$diff = $d;
					$found =  $character;
				}
			}
		}

		return $found;
	}



	protected function enqueue()
	{
		$this->queue = array_sort(array_where(array_join($this->red, $this->blue), function($key, $value)
		{
			return $value[1]->health > 0;

		}), function($value)
		{
			return $value[1]->getSpeed();
		});
	}

	protected function pull()
	{
		return array_shift($this->queue);
	}

	protected function move()
	{
		list($team, $character) = $this->pull();
		$enemy = null;


		if($team == 'red')
		{
			$enemy = $this->findBlue($character->level);
		}
		elseif($team == 'blue')
		{
			$enemy = $this->findRed($character->level);
		}

		if(!is_null($enemy))
		{
			$damage = $character->rollDamage();
			$defense = 0;

			if(!$character->rollCrit())
				$defense = $enemy->getDamage();

			$hit = $character->rollHit();
			$dodge = $enemy->rollDodge();

			if($hit >= $dodge)
			{
				$enemy->health -= max($damage - $defense, 1);
			}
		}
	}

	protected function turn()
	{
		$this->enqueue();

		while(count($this->queue) > 0)
		{
			$this->move();
		}
	}

	protected function hasRed()
	{
		foreach($this->red as $record)
		{
			$character = $record[1];

			if($character->health > 0)
				return true;
		}
		return false;
	}

	protected function hasBlue()
	{
		foreach($this->blue as $record)
		{
			$character = $record[1];

			if($character->health > 0)
				return true;
		}
		return false;
	}

	public function battle()
	{
		while($this->hasRed() && $this->hasBlue())
		{
			$this->turn();
		}
	}




}
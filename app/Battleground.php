<?php
namespace HempEmpire;
use TransText;
use TextArray;


class Battleground
{
	private $lastBattleId = 0;
	private $red = [];
	private $blue = [];
	private $report = ['teams' => ['blue' => [], 'red' => []], 'marks' => [], 'log' => []];
	private $queue;


	public function joinRed($character)
	{
		$character->battleId = ++$this->lastBattleId;
		$this->reportJoin($character, 'red');
		$this->red[] = ['red', $character];
	}

	public function joinBlue($character)
	{
		$character->battleId = ++$this->lastBattleId;
		$this->reportJoin($character, 'blue');
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

		if(!is_null($enemy) && $character->health > 0)
		{
			$damage = $character->rollDamage();
			$defense = 0;
			$crit = $character->rollCrit();

			if(!$crit)
				$defense = $enemy->getDefense();

			$hit = $character->rollHit();
			$dodge = $enemy->rollDodge();


			if($hit >= $dodge)
			{
				$this->reportHit($character, $enemy, $damage, $defense, $crit);
				$enemy->health -= max($damage - $defense, 1);

				if($enemy->health <= 0)
					$this->reportDie($enemy);
			}
			else
			{
				$this->reportMiss($character, $enemy);
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


	protected function reportHit($attacker, $defender, $damage, $defense, $crit)
	{
		if(empty($this->report['log']))
			$this->report['log'] = [];


		$this->report['log'][] = [

			'type' => 'hit',
			'attacker' => $attacker->battleId,
			'defender' => $defender->battleId,
			'damage' => max($damage - $defense, 1),
			'health' => $defender->health,
			'crit' => $crit,
		];
	}

	protected function reportMiss($attacker, $defender)
	{
		if(empty($this->report['log']))
			$this->report['log'] = [];


		$this->report['log'][] = [

			'type' => 'miss',
			'attacker' => $attacker->battleId,
			'defender' => $defender->battleId,
		];
	}

	protected function reportJoin($character, $team)
	{
		if(empty($this->report['teams']))
			$this->report['teams'] = [];

		if(empty($this->report['teams'][$team]))
			$this->report['teams'][$team] = [];

		$this->report['teams'][$team][] = [

			'id' => $character->battleId,
			'name' => $character->name,
			'avatar' => $character->avatar,
			'level' => $character->level,
			'health' => $character->health,
			'maxHealth' => $character->maxHealth,
			'strength' => $character->strength,
			'perception' => $character->perception,
			'endurance' => $character->endurance,
			'charisma' => $character->charisma,
			'intelligence' => $character->intelligence,
			'agility' => $character->agility,
			'luck' => $character->luck,
		];
	}

	protected function reportDie($character)
	{
		if(empty($this->report['marks']))
			$this->report['marks'] = [];

		$this->report['marks'][] = [

			'type' => 'fainted',
			'at' => count($this->report['log']) - 1,
		];
	}

	public function report($character)
	{
		if(is_null($character))
		{
			unset($this->report['win']);
		}
		else
		{
			$this->report['win'] = $this->findTeam($character) == $this->winner();
		}

		return '<div class="battle-log">' . json_encode($this->report) . '</div>';
	}

	protected function findTeam($character)
	{
		foreach($this->red as $red)
		{
			if($red[1]->battleId == $character->battleId)
				return 'red';
		}

		foreach($this->blue as $blue)
		{
			if($blue[1]->battleId == $character->battleId)
				return 'blue';
		}

		return null;
	}

	public function winner()
	{
		if($this->hasRed())
		{
			return 'red';
		}
		elseif($this->hasBlue())
		{
			return 'blue';
		}
		else
		{
			return null;
		}
	}

}
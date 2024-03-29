<?php

namespace HempEmpire\Components;
use HempEmpire\Timer;
use DB;

class Rent extends Component
{
	protected $index = -100;
	protected $timer;


	public function init()
	{
		$timer = $this->getRentTimer();

		if(!is_null($timer) && $timer->active)
		{
			$this->index = -$this->index;
		}
	}

	protected function receives($namespace, $action)
	{
		return true;
	}


	private function getRentTimer()
	{
		if(empty($this->timer))
			$this->timer = $this->getPlace()->timers()->whereName('rent')->first();

		return $this->timer;
	}

	private function getRentCost()
	{
		return round($this->getProperty('cost', 1000) * $this->player->level * lerp($this->player->charisma / 100, 1.5, 0.4));
	}

	private function getRentDuration()
	{
		return round($this->getProperty('duration', 7 * 24 * 3600) * $this->player->world->timeScale);
	}

	public function view()
	{
		$timer = $this->getRentTimer();

		if(is_null($timer) || !$timer->active)
		{
			$this->prevent();
			return view('component.rent')
				->with('cost', $this->getRentCost())
				->with('duration', $this->getRentDuration());
		}
		else
		{
			$container = entity()
				->addClass('text-center');

			$well = entity()
				->addClass('well');

			$row = entity()
				->addClass('row');

			$col = entity()
				->addClass('col-md-6')
				->addClass('col-md-offset-3');

			$progress = entity('timer')
				->min($timer->start)
				->max($timer->end)
				->now(time())
				->reversed(true);

			return $container
				->append($well
					->append('<h4>' . trans('rent.left') . '</h4>')
					->append($row
						->append($col
							->append($progress))));
		}
	}

	public function action($name, $request)
	{
		if($name == 'work' || $name == 'reset')
		{
			return;
		}
		elseif($name !== 'rent')
		{

			$timer = $this->getRentTimer();

			if(is_null($timer) || !$timer->active)
			{
				$this->danger('placeNotRented');
				$this->prevent();
			}
		}
		else
		{
			$timer = $this->getRentTimer();
			$cost = $this->getRentCost();
			$duration = $this->getRentDuration();
			
			if(!is_null($timer) && $timer->active)
			{
				$this->danger('placeAlreadyRented');
			}
			elseif($this->player->money < $cost)
			{
				$this->danger('notEnoughMoney')
					->with('value', $cost);
			}
			else
			{
				$start = time();
				$end = $start + $duration;

				if(is_null($timer))
				{
					$timer = new Timer;
					$timer->name = 'rent';
				}

				$this->player->money -= $cost;
				$timer->start = $start;
				$timer->end = $end;

				$success = DB::transaction(function() use($timer)
				{
					return $this->player->save() &&
						$timer->owner()->associate($this->place) &&
						$timer->save();
				});

				if($success)
				{
					$this->success('placeRented');
				}
				else
				{
					$this->danger('saveError');
				}
			}
		}
	}
}
<?php

namespace HempEmpire\Components;
use DB;


class Church extends Component
{
	protected $timer;


	public function init()
	{
		$this->timer =  $this->getPlace()->timers()->whereName('bless')->first();

		if(is_null($this->timer))
		{
			$this->timer = $this->getPlace()->timers()->create([

				'name' => 'bless',
				'start' => 0,
				'end' => 0,
			]);
		}
	}


	public function view()
	{
		return view('component.church')
			->with('bonus', $this->getProperty('bonus'))
			->with('price', $this->getProperty('price') * $this->player->level)
			->with('timer', $this->timer);
	}


	public function actionBless()
	{
		$price = $this->getProperty('price');


		if($this->timer->active)
		{
			$this->danger('blessNotReady');
		}
		elseif($this->player->money < $price)
		{
			$this->danger('notEnoughMoney')
				->with('value', $price);
		}
		else
		{
			$now = time();
			$duration = round($this->getProperty('duration') * $this->player->world->timeScale);

			$this->player->luckUpdate = $now;
			$this->player->luck += $this->getProperty('bonus');
			$this->player->money -= $price;

			$this->timer->start = $now;
			$this->timer->end = $now + $duration;

			$success = DB::transaction(function()
			{
				return $this->player->save() && $this->timer->save();
			});

			if($success)
			{
				$this->success('blessed');
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}
}
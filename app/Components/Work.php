<?php

namespace HempEmpire\Components;
use HempEmpire\WorkGroup;
use HempEmpire\WorkManager;
use HempEmpire\Jobs\WorkEnds;
use DB;
use Config;
use Debugbar;

use Event;
use HempEmpire\Events\WorkStart;



class Work extends Component
{
	protected $index = -200;
	protected $manager;
	protected $works = [];


	public function init()
	{
		$this->manager = WorkManager::firstOrCreate([

			'player_id' => $this->player->id,
			'location_place_id' => $this->getPlaceId(),
		]);


		$this->manager->setResetInterval($this->getProperty('reset') * $this->player->world->timeScale);
		$this->manager->setResetCooldown($this->getProperty('resetCooldown') * $this->player->world->timeScale);
		
		$this->manager->setWorksAtOnce($this->getProperty('atOnce'));
		$this->manager->setWorksPerGroup($this->getProperty('perGroup'));
		$this->manager->setGroups(explode_trim(',', $this->getProperty('groups')));
		$this->manager->setResetable($this->getProperty('resetable', false));


		$this->manager->refresh();
	}




	public function view()
	{
		return view('component.work')
			->with('lastUpdate', $this->manager->getLastUpdate())
			->with('nextUpdate', $this->manager->getNextUpdate())
			->with('resetable', $this->manager->isResetable())
			->with('resetCost', $this->getProperty('resetCost'))
			->with('lastReset', $this->manager->getLastReset())
			->with('nextReset', $this->manager->getResetAvailable())
			->with('works', collection_paginate($this->manager->getWorks(), 16));
	}






	


	public function actionWork($request)
	{
		$work = $this->manager->findWork($request->input('work'));


		if(is_null($work))
		{
			$this->danger('invalidWork');
		}
		else
		{
			$costs = $work->work->getCosts();
			$requirements = $work->work->getRequirements();

		
			if(!$requirements->check())
			{
				$this->danger('requirementsNotMet');
			}
			elseif(!$costs->canTake())
			{
				$this->danger('cantTakeCosts');
			}
			else
			{
				$duration = round($work->work->duration * $this->player->world->timeScale);


				$this->player->startWorking($duration, false);

				$work->active = false;
				$work->save();

				if($costs->take($this->player))
				{
					$job = new WorkEnds($this->player, $work);
					$job->delay($duration);

					$this->dispatch($job);


					Event::fire(new WorkStart($this->player, $work));

					$this->success('workStarted')
						->with('name', $work->work->getTitle());
				}
				else
				{
					$this->danger('unknown');
				}
			}
		}
	}



	public function actionReset()
	{
		$cost = $this->getProperty('resetCost');

		//dd($this->manager, date('Y-m-d H:i:s', $next), date('Y-m-d H:i:s'));

		if($this->player->premiumPoints < $cost)
		{
			$this->danger('notEnoughPremiumPoints')
				->with('value', $cost);
		}
		elseif(!$this->manager->isResetable())
		{
			$this->danger('cantReset');
		}
		elseif(!is_null($this->manager->getLastReset()) && $this->manager->getResetAvailable() > time())
		{
			$this->danger('cantResetYet');
		}
		else
		{
			$this->player->user->premiumPoints -= $cost;


			$success = DB::transaction(function()
			{
				return $this->player->user->save() && $this->manager->reset();
			});

			if($success)
			{
				$this->success('workReseted');
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}


	public function commandReset()
	{
		$this->manager->setGroups(explode_trim(',', $this->getProperty('groups')));
		$this->manager->refresh(true);
	}

}
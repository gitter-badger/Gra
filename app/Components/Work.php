<?php

namespace HempEmpire\Components;
use HempEmpire\CurrentWorkGroup as CurrentGroup;
use HempEmpire\WorkGroup;
use HempEmpire\Jobs\WorkEnds;
use Config;



class Work extends Component
{
	private $works = [];
	private $lastUpdate;
	private $nextUpdate;




	public function init()
	{
		$workReset = $this->getProperty('reset');
		$atOnce = $this->getProperty('atOnce');
		$perGroup = $this->getProperty('perGroup');


		if(Config::get('app.debug', false))
			$workReset = 600;


		$groups = explode_trim(',', $this->getProperty('groups'));
		$groups = WorkGroup::whereIn('name', $groups)->with('works')->get();


		foreach($groups as $group)
		{
			$currentGroup = CurrentGroup::firstOrCreate([

				'player_id' => $this->player->id,
				'work_group_id' => $group->id,
				'location_place_id' => $this->getPlaceId(),
			]);

			if(is_null($this->lastUpdate))
			{
				$this->lastUpdate = $currentGroup->lastUpdated;
			}
			else
			{
				$this->lastUpdate = min($currentGroup->lastUpdated, $this->lastUpdate);
			}



			if(is_null($currentGroup->lastUpdated) || (time() - $currentGroup->lastUpdated) >= $workReset)
			{

				$currentGroup->lastUpdated = time();

				$currentGroup->works()->update(['active' => false]);
				$currentGroup->save();


				$works = $group->works->all();


				for($i = 0; $i < $perGroup; ++$i)
				{
					if(count($works) > 0)
					{
						$n = mt_rand(0, count($works) - 1);
						$m = $works[$n];


						$c = $currentGroup->works()->firstOrCreate([

							'work_id' => $m->id,
						]);


						$c->active = true;
						$c->order = $i;
						$c->save();

						unset($works[$n]);
						$works = array_values($works);
					}
				}

			}

			$works = $currentGroup->works()->where(['active' => true])
				->orderBy('order', 'asc')->take($atOnce)->with('work')->get();


			foreach($works as $work)
				$this->works[$work->id] = $work;
		}

		if(!is_null($this->lastUpdate))
			$this->lastUpdate = time();

		$this->nextUpdate = $this->lastUpdate + $workReset;
	}



	private function getWorks()
	{
		$works = collect([]);

		foreach($this->works as $work)
			$works->push($work->work);


		return $works;
	}



	private function findWork($id)
	{
		foreach($this->works as $work)
		{
			if($work->work->id == $id)
				return $work;
		}
		return null;
	}




	public function view()
	{
		return view('component.work')
			->with('lastUpdate', $this->lastUpdate)
			->with('nextUpdate', $this->nextUpdate)
			->with('works', collection_paginate($this->getWorks(), 16));
	}






	


	public function actionWork($request)
	{
		$work = $this->findWork($request->input('work'));


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
				$duration = $work->work->duration;

				if(Config::get('app.debug', false))
					$duration /= 60;


				$this->player->startWorking($duration, false);

				$work->active = false;
				$work->save();

				if($costs->take($this->player))
				{
					$job = new WorkEnds($this->player, $work);
					$job->delay($duration);

					$this->dispatch($job);

					$this->success('workStarted')
						->with('name', lcfirst($work->work->getTitle()));
				}
				else
				{
					$this->danger('unknown');
				}
			}
		}
	}
	
}
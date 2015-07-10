<?php


namespace HempEmpire\Components;
use HempEmpire\Location;
use HempEmpire\Jobs\TravelEnds;
use Config;

class Travel extends Component
{


	protected function getLocations()
	{
		$result = [];

		$groups = explode_trim(',', $this->getProperty('available'));
		$locations = Location::where('id', '<>', $this->player->location->id)->get();


		foreach($locations as $location)
		{
			foreach($groups as $group)
			{
				if($location->is($group))
				{
					$result[] = $location;
					break;
				}
			}
		}

		return $result;
	}

	protected function findLocation($id)
	{
		if($id != $this->player->location->id)
		{
			$location = Location::findOrFail($id);

			$groups = explode_trim(',', $this->getProperty('available'));


			foreach($groups as $group)
			{
				if($location->is($group))
				{
					return $location;
				}
			}
		}

		return null;
	}



	protected function getSpeed()
	{
		if(Config::get('app.debug', false))
		{
			return (1.0 / $this->getProperty('speed'));
		}
		else
		{
			return (1.0 / $this->getProperty('speed')) * 3600;
		}
	}

	protected function getCost()
	{
		return $this->getProperty('cost');
	}


	public function view()
	{

		return view('component.travel')
			->with('speed', $this->getSpeed())
			->with('cost', $this->getCost())
			->with('current', $this->player->location)
			->with('locations', $this->getLocations());
	}

	public function actionTravel($request)
	{
		$location = $this->findLocation($request->input('location'));

		if(is_null($location))
		{
			$this->danger('invalidLocation');
		}
		else
		{
			$distance = $this->player->location->getDistanceTo($location);

			$duration = round($distance * $this->getSpeed());
			$cost = round($distance * $this->getCost());


			if($this->player->money < $cost)
			{
				$this->danger('notEnoughMoney')
					->with('value', $cost);
			}
			else
			{
				$start = time();
				$end = $start + $duration;



				$this->player->money -= $cost;
				$this->player->location_place_id = null;
				$this->player->jobName = 'travel';
				$this->player->jobStart = $start;
				$this->player->jobEnd = $end;
				$this->player->energyUpdate = $end;


				if($this->player->save())
				{
					$job = new TravelEnds($this->player, $location);
					$job->delay($duration);

					$this->dispatch($job);

					$this->success('travelStarted');
				}
				else
				{
					$this->danger('unknown');
				}
			}
		}
	}
}
<?php


namespace HempEmpire\Components;
use HempEmpire\Location;
use HempEmpire\Jobs\TravelEnds;
use HempEmpire\Events\LocationLeave;
use Event;
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
			return (1.0 / $this->getProperty('speed')) * 60;
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
		$to = $this->findLocation($request->input('location'));
		$from = $this->player->location;

		if(is_null($to))
		{
			$this->danger('invalidLocation');
		}
		else
		{
			$distance = $from->getDistanceTo($to);

			$duration = round($distance * $this->getSpeed());
			$cost = round($distance * $this->getCost());


			if($this->player->money < $cost)
			{
				$this->danger('notEnoughMoney')
					->with('value', $cost);
			}
			else
			{
				if(Config::get('app.debug', false))
					$duration /= 60;

				$this->player->money -= $cost;
                $this->player->location()->associate($to);
                $this->player->moveTo(null, false);
                $this->player->startTraveling($duration, false);


				if($this->player->save())
				{
					$job = new TravelEnds($this->player, $from, $to, $this->getSpeed(), $this->getCost());
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
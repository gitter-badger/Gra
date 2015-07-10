<?php

namespace HempEmpire\Components;
use HempEmpire\Plantation as PlantationModel;
use HempEmpire\PlantationSlot as SlotModel;
use HempEmpire\Jobs\Harvest as HarvestJob;
use Request;
use Config;
use DB;



class Plantation extends Component
{
	private $plantation;



	public function init()
	{
		$this->plantation = PlantationModel::firstOrNew([

			'player_id' => $this->player->id,
			'location_place_id' => $this->getPlaceId(),
		]);

		if(!$this->plantation->exists)
		{
			$slots = $this->getProperty('slots');

			$this->plantation->light = $this->getProperty('light');
			$this->plantation->ground = $this->getProperty('ground');



			DB::transaction(function() use($slots)
			{
				$this->plantation->save();

				for($i = 0; $i < $slots; ++$i)
					$this->plantation->slots()->create(['isEmpty' => true]);

			});
		}
	}




	public function view()
	{
		return view('component.plantation')
			->with('slots', $this->plantation->slots)
			->with('seeds', $this->player->getSeeds());
	}

	protected function isSlotValid($slot)
	{
		return !is_null($slot) && $slot >= 0 && $slot < $this->plantation->slots->count();
	}

	public function actionPlant()
	{
		$slot = Request::input('slot');
		$seed = $this->player->findItemById('seed', Request::input('seed'));

		if(!$this->isSlotValid($slot))
		{
			$this->danger('plantationWrongSlot');
		}
		elseif(is_null($seed) || $seed->getCount() < 1)
		{
			$this->danger('plantationWrongSeed');
		}
		else
		{
			$now = time();
			$slot = $this->plantation->slots[$slot];
			$energy = Config::get('player.planting.energy');
			$duration = Config::get('player.planting.duration');

			$growth = $seed->getGrowth() * $this->plantation->light;
			$watering = $seed->getWatering() * $this->plantation->ground;

			$harvestIncrease = (100 + $this->player->plantatorLevel * 5) / 100;



			if(Config::get('app.debug', false))
			{
				$duration /= 60;
				$growth /= 60;
				$watering /= 60;
			}


			if(!$slot->isEmpty)
			{
				$this->danger('plantationSlotNotEmpty');
			}
			elseif($this->player->energy < $energy)
			{
				$this->danger('notEnoughEnergy')
					->with('value', $energy);
			}
			else
			{
				$this->player->energy -= $energy;
				$this->player->jobName = 'planting';
				$this->player->jobStart = $now;
				$this->player->jobEnd = $now + $duration;
				$this->player->energyUpdate = $now + $duration;

				$slot->isEmpty = false;
				$slot->species = $seed->getSpecies();
				$slot->watering = $watering;
				$slot->harvestMin = $seed->getMinHarvest() * $harvestIncrease;
				$slot->harvestMax = $seed->getMaxHarvest() * $harvestIncrease;
				$slot->quality = $seed->getQuality();
				$slot->start = $now + $duration;
				$slot->end = $now + $growth + $duration;
				$slot->lastWatered = $now + $duration;

				$success = DB::transaction(function() use($slot, $seed)
				{
					return $slot->save() && $this->player->takeItem($seed, 1) && $this->player->save();
				});

				if($success)
				{
					$this->success('seedPlanted')
						->with('name', $seed->getTitle())
						->delay($duration);
				}
				else
				{
					$this->danger('saveError');
				}
			}
		}
	}

	public function actionWatering()
	{
		$slot = Request::input('slot');

		if(!$this->isSlotValid($slot))
		{
			$this->danger('plantationWrongSlot');
		}
		else
		{
			$now = time();
			$slot = $this->plantation->slots[$slot];
			$energy = Config::get('player.watering.energy');


			if($this->player->energy < $energy)
			{
				$this->danger('notEnoughEnergy')
					->with('value', $energy);
			}
			else
			{
				$this->player->energy -= $energy;
				$overwatered = false;

				if($slot->nextWatering > $now)
				{
					$overwatered = true;
					$slot->harvestMax *= 0.85;
					$slot->harvestMin *= 0.75;
					$slot->quality = max($slot->quality - 1, 1);
				}

				$dryFor = max($now - $slot->nextWatering, 0);
				$slot->start += $dryFor;
				$slot->end += $dryFor;
				$slot->lastWatered = $now;


				$success = DB::transaction(function() use($slot)
				{
					return $this->player->save() && $slot->save();
				});

				if($success)
				{
					if($overwatered)
					{
						$this->warning('plantOverwatered');
					}
					else
					{
						$this->success('plantWatered');
					}
				}
				else
				{
					$this->danger('saveError');
				}
			}
		}
	}

	public function actionHarvest()
	{
		$slot = Request::input('slot');

		if(!$this->isSlotValid($slot))
		{
			$this->danger('plantationWrongSlot');
		}
		else
		{
			$now = time();
			$slot = $this->plantation->slots[$slot];
			$energy = Config::get('player.harvesting.energy');
			$duration = Config::get('player.harvesting.duration');



			if(Config::get('app.debug', false))
			{
				$duration /= 60;
			}


			if($slot->isEmpty)
			{
				$this->danger('plantationSlotEmpty');
			}
			elseif($this->player->energy < $energy)
			{
				$this->danger('notEnoughEnergy')
					->with('value', $energy);
			}
			elseif($slot->end > $now)
			{
				$this->danger('plantNotReady');
			}
			else
			{

				$this->player->energy -= $energy;
				$this->player->jobName = 'harvesting';
				$this->player->jobStart = $now;
				$this->player->jobEnd = $now + $duration;
				$this->player->energyUpdate = $now + $duration;

				$slot->isEmpty = true;


				$job = new HarvestJob($this->player, $slot->species, $slot->quality, $slot->harvestMin, $slot->harvestMax);
				$job->delay($duration);





				$success = DB::transaction(function() use($slot)
				{
					return $slot->save() && $this->player->save();
				});

				if($success)
				{
					$this->dispatch($job);
				}
				else
				{
					$this->danger('saveError');
				}
			}
		}
	}
}
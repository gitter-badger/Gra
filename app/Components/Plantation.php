<?php

namespace HempEmpire\Components;
use HempEmpire\Plantation as PlantationModel;
use HempEmpire\PlantationSlot as SlotModel;
use HempEmpire\Jobs\Harvest as HarvestJob;
use HempEmpire\Jobs\Plant as PlantJob;
use HempEmpire\Events\Watering as WateringEvent;
use HempEmpire\Events\Harvest as HarvestEvent;
use Request;
use Config;
use Event;
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
			$duration = round(Config::get('player.planting.duration') * $this->player->world->timeScale);

			$growth = round($seed->getGrowth() * $this->plantation->light * $this->player->world->timeScale);
			$watering = round($seed->getWatering() * $this->plantation->ground * $this->player->world->timeScale);
			$quality = $seed->getQuality();


			if($this->player->hasTalent('planting-energy'))
				$energy /= 2;

			if($this->player->hasTalent('planting-fast'))
				$duration /= 2;


			if($this->player->hasTalent('planting-better'))
				$growth *= 0.75;



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
				$this->player->startPlanting($duration, false);

				$slot->isEmpty = false;
				$slot->species = $seed->getSpecies();
				$slot->watering = $watering;
				$slot->harvestMin = $seed->getMinHarvest();
				$slot->harvestMax = $seed->getMaxHarvest();
				$slot->quality = $quality;
				$slot->start = $now + $duration;
				$slot->end = $now + $growth + $duration;
				$slot->lastWatered = $now + $duration;

				$success = DB::transaction(function() use($slot, $seed)
				{
					return $slot->save() && $this->player->takeItem($seed, 1) && $this->player->save();
				});

				if($success)
				{
					$job = new PlantJob($this->player, $slot);
					$job->delay($duration);

					$this->dispatch($job);

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


			if($this->player->hasTalent('watering-energy'))
				$energy /= 2;


			if($this->player->energy < $energy)
			{
				$this->danger('notEnoughEnergy')
					->with('value', $energy);
			}
			else
			{
				$this->player->energy -= $energy;
				$overwatered = false;

				if($slot->nextWatering > $now && !$this->player->hasTalent('watering-better'))
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
					Event::fire(new WateringEvent($this->player, $slot));
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
			$duration = round(Config::get('player.harvesting.duration') * $this->player->world->timeScale);

			if($this->player->hasTalent('harvesting-energy'))
				$energy /= 2;

			if($this->player->hasTalent('harvesting-fast'))
				$duration /= 2;



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
				$harvestIncrease = (100 + $this->player->plantatorLevel * 5) / 100;
				$quality = $slot->quality;
				$this->player->energy -= $energy;
				$this->player->startHarvesting($duration, false);
				$harvestMin = floor($slot->harvestMin * $harvestIncrease);
				$harvestMax = ceil($slot->harvestMax * $harvestIncrease);
				
				$slot->isEmpty = true;


				if($this->player->hasTalent('harvesting-batter'))
					$quality = min($quality + 1, 5);



				$job = new HarvestJob($this->player, $slot->species, $quality, $slot->harvestMin, $slot->harvestMax);
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
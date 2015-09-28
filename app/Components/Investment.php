<?php

namespace HempEmpire\Components;
use HempEmpire\Investment as InvestmentModel;
use HempEmpire\PlayerInvestment as PlayerInvestmentModel;
use HempEmpire\WorkManager;
use DB;
use Config;
use Request;
use Debugbar;

use Event;
use HempEmpire\Events\WorkStart;


class Investment extends Component
{
	private $investment;


	public function init()
	{
		$name = $this->getProperty('name');
		$price = $this->getProperty('price');
		$investment = InvestmentModel::whereName($name)->firstOrFail();




		$this->investment = $investment->investments()->firstOrNew([

			'player_id' => $this->player->id,
			'location_place_id' => $this->getPlaceId(),
			'investment_id' => $investment->id,
		]);


		if(!$this->investment->exists)
		{
			$this->investment->bought = is_null($price);
			$this->investment->money = 0;
			$this->investment->incomeLevel = 1;
			$this->investment->capacityLevel = 1;
			$this->investment->lastUpdate = time();
			$this->investment->worksCount = 0;

			if($this->place->hasComponent('work'))
			{
				$this->investment->worksNeeded = $this->getProperty('worksNeeded');
			}
			else
			{
				$this->investment->worksNeeded = 0;
			}
		}

		$this->investment->updateMoney();

		if(isset($this->manager))
		{
			$this->manager->refresh();
		}


		if($this->investment->bought)
		{
			$groups = $this->getProperty('groups');

			if(!is_null($groups))
				$this->setProperty('work.groups', $groups);

			$this->index = -10;
		}
		else
		{
			$this->index = 10;
		}


		Event::listen(WorkStart::class, function($event)
		{
			$this->investment->worksCount++;
			$this->investment->save();
		});

	}

	public function view()
	{
		return view('component.investment')
			->with('investment', $this->investment)
			->with('managers', Config::get('managers'))
			->with('price', $this->getProperty('price'));
	}

	public function actionCollect()
	{
		if(!$this->investment->bought)
		{
			$this->danger('investmentNotBought');
		}
		if($this->investment->money == 0)
		{
			$this->danger('nothingToCollect');
		}
		else
		{
			$money = $this->investment->money;
			$this->player->money += $money;
			$this->investment->money = 0;

			$success = DB::transaction(function()
			{
				return $this->player->save() && $this->investment->save();
			});

			if($success)
			{
				$this->success('investmentCollected')
					->with('value', $money);
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

	public function actionUpgrade()
	{
		$upgrade = Request::input('upgrade');

		if(!$this->investment->bought)
		{
			$this->danger('investmentNotBought');
		}
		elseif($upgrade == 'income')
		{
			if($this->investment->incomeLevel >= $this->investment->incomeMaxLevel)
			{
				$this->danger('upgradeMaxLevel');
			}
			elseif($this->player->money < $this->investment->upgradeCost)
			{
				$this->danger('notEnoughMoney')
					->with('value', $this->investment->upgradeCost);
			}
			else
			{
				$this->player->money -= $this->investment->upgradeCost;
				$this->investment->incomeLevel++;

				$success = DB::transaction(function()
				{
					return $this->player->save() && $this->investment->save();
				});


				if($success)
				{
					$this->success('incomeUpgrated')
						->with('value', $this->investment->investment->incomePerLevel);
				}
				else
				{
					$this->danger('saveError');
				}
			}
		}
		elseif($upgrade == 'capacity')
		{
			if($this->investment->capacityLevel >= $this->investment->capacityMaxLevel)
			{
				$this->danger('upgradeMaxLevel');
			}
			elseif($this->player->money < $this->investment->upgradeCost)
			{
				$this->danger('notEnoughMoney')
					->with('value', $this->investment->upgradeCost);
			}
			else
			{
				$this->player->money -= $this->investment->upgradeCost;
				$this->investment->capacityLevel++;

				$success = DB::transaction(function()
				{
					return $this->player->save() && $this->investment->save();
				});


				if($success)
				{
					$this->success('capacityUpgrated')
						->with('value', $this->investment->investment->capacityPerLevel);
				}
				else
				{
					$this->danger('saveError');
				}
			}
		}
	}

	public function actionInvest()
	{
		$price = $this->getProperty('price');

		if(is_null($price) || $this->investment->bought)
		{
			$this->danger('investmentAlreadyBought');
		}
		elseif($this->player->money < $price)
		{
			$this->danger('notEnoughtMoney')
				->with('value', $price);
		}
		elseif($this->investment->worksCount < $this->investment->worksNeeded)
		{
			$this->danger('investmentNotReady');
		}
		else
		{
			$this->player->money -= $price;
			$this->investment->bought = true;
			$this->investment->lastUpdate = time();


			$success = DB::transaction(function()
			{
				return $this->player->save() && $this->investment->save();
			});

			if($success)
			{

				$groups = $this->getProperty('groups');

				if(!is_null($groups))
					$this->setProperty('work.groups', $groups);

				$this->call('work', 'reset');

				$this->success('investmentBought');
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

	public function actionHire()
	{
		$manager = Config::get('managers.' . Request::input('manager'));

		if(is_null($manager))
		{
			$this->danger('wrongManager');
		}
		elseif($this->player->money < $manager['price'])
		{
			$this->danger('notEnoughMoney')
				->with('value', $manager['price']);
		}
		elseif($this->investment->hasManager())
		{
			$this->danger('alreadyHasManager');
		}
		else
		{
			$this->player->money -= $manager['price'];

			$this->investment->managerId = Request::input('manager');
			$this->investment->managerExpires = time() + round($manager['duration'] * $this->player->world->timeScale);
			$this->investment->managerMoney = 0;


			$success = DB::transaction(function()
			{
				return $this->player->save() && $this->investment->save();
			});


			if($success)
			{
				$this->success('managerHired');
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

	public function actionReceive()
	{
		if(!$this->investment->hasManager())
		{
			$this->danger('dontHaveManager');
		}
		elseif($this->investment->managerMoney <= 0)
		{
			$this->danger('dontHaveMoney');
		}
		else
		{
			$money = $this->investment->managerMoney;

			$this->player->money += $this->investment->managerMoney;
			$this->investment->managerMoney = 0;


			$success = DB::transaction(function()
			{
				return $this->player->save() && $this->investment->save();
			});


			if($success)
			{
				$this->success('managerCollected')
					->with('value', $money);
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

	public function actionRelease()
	{
		if(!$this->investment->hasManager())
		{
			$this->danger('dontHaveManager');
		}
		else
		{
			$money = $this->investment->managerMoney;

			$this->player->money += $this->investment->managerMoney;
			$this->investment->managerMoney = 0;
			$this->investment->managerId = null;


			$success = DB::transaction(function()
			{
				return $this->player->save() && $this->investment->save();
			});


			if($success)
			{
				if($money > 0)
				{
					$this->success('managerCollected')
						->with('value', $money);
				}

				$this->success('managerReleased');
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}
}
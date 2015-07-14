<?php

namespace HempEmpire\Components;
use HempEmpire\Investment as InvestmentModel;
use HempEmpire\PlayerInvestment as PlayerInvestmentModel;
use DB;
use Request;


class Investment extends Component
{
	private $investment;


	public function init()
	{
		$name = $this->getProperty('name');
		$investment = InvestmentModel::whereName($name)->firstOrFail();



		$this->investment = $investment->investments()->firstOrNew([

			'player_id' => $this->player->id,
			'location_place_id' => $this->getPlaceId(),
			'investment_id' => $investment->id,
		]);


		if(!$this->investment->exists)
		{
			$this->investment->money = 0;
			$this->investment->incomeLevel = 1;
			$this->investment->capacityLevel = 1;
			$this->investment->lastUpdate = time();
		}
	}

	public function view()
	{
		return view('component.investment')
			->with('investment', $this->investment);
	}

	public function actionCollect()
	{
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


		if($upgrade == 'income')
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
}
<?php

namespace HempEmpire\Components;
use HempEmpire\Bank as BankModel;
use Request;
use DB;


class Bank extends Component
{
	private $bank;

	public function init()
	{
		$this->bank = BankModel::firstOrCreate([

			'player_id' => $this->player->id,
			'location_place_id' => $this->getPlaceId(),
		]);
	}


	public function view()
	{
		$view = Request::input('view', 'deposit');


		if($view != 'deposit' && $view != 'withdraw')
			$view = 'deposit';


		return view('component.bank')
			->with('bank', $this->bank)
			->with('view', $view);
	}


	public function actionDeposit()
	{
		$money = Request::input('money');

		if($this->player->money < $money)
		{
			$this->danger('notEnoughMoney')
				->with('value', $money);
		}
		else
		{
			$this->player->money -= $money;
			$this->bank->money += $money;

			$success = DB::transaction(function()
			{
				return $this->player->save() && $this->bank->save();
			});

			if($success)
			{
				$this->success('moneyDeposited')
					->with('value', $money);
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}


	public function actionWithdraw()
	{
		$money = Request::input('money');

		if($this->bank->money < $money)
		{
			$this->danger('cantWithdrawMoney')
				->with('value', $money);
		}
		else
		{
			$this->player->money += $money;
			$this->bank->money -= $money;

			$success = DB::transaction(function()
			{
				return $this->player->save() && $this->bank->save();
			});

			if($success)
			{
				$this->success('moneyWithdrawed')
					->with('value', $money);
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

}
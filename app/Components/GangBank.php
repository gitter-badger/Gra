<?php

namespace HempEmpire\Components;
use HempEmpire\GangMember as Member;
use Request;
use DB;


class GangBank extends Component
{
	protected $gang;
	protected $canDeposit;
	protected $canWithdraw;

	public function init()
	{
		$this->gang = $this->player->gang;
		$this->canDeposit = false;
		$this->canWithdraw = false;

		if(!is_null($this->gang))
		{
			$member = $this->gang->members()->where('player_id', '=', $this->player->id)->first();

			$this->canDeposit = $member->can(Member::PERMISSION_DEPOSIT_MONEY);
			$this->canWithdraw = $member->can(Member::PERMISSION_WITHDRAW_MONEY);
		}
	}

	public function view()
	{
		$view = Request::input('view', 'deposit');

		if($view == 'deposit' && !$this->canDeposit)
			$view = 'widthdraw';

		if($view == 'widthdraw' && !$this->canWithdraw)
			$view = 'deposit';

		if($view != 'deposit' && $view != 'withdraw')
			$view = 'deposit';


		return view('component.gang-bank')
			->with('gang', $this->gang)
			->with('canDeposit', $this->canDeposit)
			->with('canWithdraw', $this->canWithdraw)
			->with('view', $view);
	}


	public function actionDeposit()
	{
		$money = Request::input('money');

		if(is_null($this->gang))
		{
			$this->danger('gangRequired');
		}
		elseif(!$this->canDeposit)
		{
			$this->danger('accessDained');
		}
		elseif($this->player->money < $money)
		{
			$this->danger('notEnoughMoney')
				->with('value', $money);
		}
		else
		{
			$this->player->money -= $money;
			$this->gang->money += $money;

			$success = DB::transaction(function()
			{
				return $this->player->save() && $this->gang->save();
			});

			if($success)
			{
				$this->player->gang->newReport('moneyDeposited')
					->subject($this->player)
					->param('money', $money)
					->save();

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

		if(is_null($this->gang))
		{
			$this->danger('gangRequired');
		}
		elseif(!$this->canWithdraw)
		{
			$this->danger('accessDained');
		}
		elseif($this->player->money < $money)
		{
			$this->danger('cantWithdrawMoney')
				->with('value', $money);
		}
		else
		{
			$this->player->money += $money;
			$this->gang->money -= $money;

			$success = DB::transaction(function()
			{
				return $this->player->save() && $this->gang->save();
			});

			if($success)
			{
				$this->player->gang->newReport('moneyWithdrawed')
					->subject($this->player)
					->param('money', $money)
					->save();

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
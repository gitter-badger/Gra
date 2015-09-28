<?php

namespace HempEmpire\Components;
use HempEmpire\Jobs\Gamble;
use Request;
use Config;

class Gambling extends Component
{
	public function view()
	{
		return view('component.gambling')
			->with('minBet', $this->getProperty('minBet'))
			->with('maxBet', $this->getProperty('maxBet'))
			->with('exchange', $this->getProperty('exchange'))
			->with('duration', $this->getProperty('duration'));
	}


	public function actionBet()
	{
		$bet = Request::input('value');

		if($bet < $this->getProperty('minBet'))
		{
			$this->danger('betToLow');
		}
		elseif($bet > $this->getProperty('maxBet'))
		{
			$this->danger('betToHigh');
		}
		elseif($this->player->money < $bet)
		{
			$this->danger('notEnoughMoney')
				->with('value', $bet);
		}
		else
		{
			$duration = round($this->getProperty('duration') * $this->player->world->timeScale);




			$this->player->money -= $bet;
			$this->player->startGambling($duration, false);

			if($this->player->save())
			{
				$job = new Gamble($this->player, $bet, $this->getProperty('exchange'));
				$job->delay($duration);

				$this->dispatch($job);

				$this->success('gamblingStarted')
					->with('bet', $bet);
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}
}
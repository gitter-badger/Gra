<?php

namespace HempEmpire\Rewards;
use HempEmpire\Contracts\Reward as RewardContract;
use HempEMpire\Debug;


abstract class Reward implements RewardContract
{

	protected function log($string)
	{
		Debug::log($string);
	}
}
<?php

namespace HempEmpire\Contracts;
use HempEmpire\Player;


interface Reward
{
	public function give(Player $player);
	public function getText();
	public function isVisible();
}
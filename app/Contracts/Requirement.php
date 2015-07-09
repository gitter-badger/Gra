<?php

namespace HempEmpire\Contracts;

use HempEmpire\Player as PlayerModel;



interface Requirement
{
	public function check(PlayerModel $player);
	public function getText();
}
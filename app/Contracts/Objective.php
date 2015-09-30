<?php

namespace HempEmpire\Contracts;
use HempEmpire\Player as PlayerModel;



interface Objective
{
	public function render();
	public function check();
	public function setup(PlayerModel $player);
	public function changed();
}
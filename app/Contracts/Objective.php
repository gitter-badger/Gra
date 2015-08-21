<?php

namespace HempEmpire\Contracts;




interface Objective
{
	public function render();
	public function check();
	public function init();
	public function changed();
}
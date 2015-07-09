<?php

namespace HempEmpire\Contracts;

interface Food extends Item
{
	public function getHealth();
	public function getEnergy();
}
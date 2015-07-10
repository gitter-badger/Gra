<?php

namespace HempEmpire\Contracts;


interface Vehicle extends Item
{
	public function getSpeed();
	public function getCost();
	public function getCapacity();
}
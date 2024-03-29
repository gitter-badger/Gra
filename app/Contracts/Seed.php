<?php

namespace HempEmpire\Contracts;

interface Seed extends Item
{
	public function getGrowth();
	public function getWatering();
	public function getSpecies();

	public function getMinHarvest();
	public function getMaxHarvest();

	public function getQuality();
}
<?php

namespace HempEmpire\Contracts;


interface Weapon extends Item
{
	/**
	 * Zwraca obrażenia broni
	 * @return array Tablica dwu-elementowa [min, max]
	 */
	public function getDamage();


	/**
	 * Zwraca szansę na cios krytyczny
	 * @return float Liczba z przedziału 0 - 1
	 */
	public function getCritChance();



	public function getSpeed();

	public function getSubType();
}


<?php

namespace HempEmpire\Contracts;



interface Character
{
	/**
	 * Pobiera nazwę postaci
	 */
	public function getName();


	public function getLevel();

	public function getHealth();
	public function getMaxHealth();

	



	/**
	 * Zwraca siłę postaci
	 * Siła wpływa na obrażenia zadane bronią białą oraz na udźwig postaci
	 */
	public function getStrength();

	/**
	 * Zwraca percepcję postaci
	 * Percepcja wypływa na obrażenia zadane bronią dystansową 
	 */
	public function getPerception();

	/**
	 * Zwraca wytrzymałość postaci
	 * Wytrzymałość wpływa na ilość pancerza
	 */
	public function getEndurance();

	/**
	 * Zwraca charyzmę postaci
	 * Charyzma wpływa na to jak postacie niezależne będą do Ciebie nastawione
	 */
	public function getCharisma();

	/**
	 * Zwraca inteligencję postaci
	 */
	public function getIntelligence();

	/**
	 * Zwraca zręczność postaci
	 */
	public function getAgility();

	/**
	 * Zwraca szczęście postaci
	 */
	public function getLuck();
}
<?php

namespace HempEmpire\Contracts;
use HempEmpire\Player as PlayerModel;

interface Item
{
	public function getId();
	public function getName();
	public function getTitle();
	public function getDescription();
	public function getImage();
	public function getType();
	public function getPrice();
	public function isPremium();
	public function getWeight();
	public function getCount();
	public function getTemplate();
	public function getRequirements();
	public function useRawValues($raw);

	public function isUsable();
	public function onUse(PlayerModel $player);
	public function onBuy(PlayerModel $player);
}
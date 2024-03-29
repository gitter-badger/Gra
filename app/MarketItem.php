<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use HempEmpire\Contracts\Item as ItemContract;


class MarketItem extends Model implements ItemContract
{
    protected $fillable = ['market_id', 'player_id', 'price', 'item_id', 'item_type'];
    public $timestamps = false;



    public function market()
    {
    	return $this->belongsTo(Market::class);
    }

    public function player()
    {
    	return $this->belongsTo(Player::class);
    }


    public function item()
    {
    	return $this->morphTo();
    }










	public function getId()
	{
		return $this->id;
	}

	public function getName()
	{
		return $this->item->getName();
	}

	public function getTitle()
	{
		return $this->item->getTitle();
	}

	public function getDescription()
	{
		return $this->item->getDescription();
	}

	public function getImage()
	{
		return $this->item->getImage();
	}

	public function getType()
	{
		return $this->item->getType();
	}

	public function getPrice()
	{
		return $this->price;
	}

	public function isPremium()
	{
		return $this->item->isPremium();
	}

	public function getCount()
	{
		return $this->item->getCount();
	}

	public function getWeight()
	{
		return $this->item->getWeight();
	}

	public function getTemplate()
	{
		return $this->item->getTemplate();
	}

	public function getRequirements()
	{
		return $this->item->getRequirements();
	}

	public function useRawValues($raw)
	{
		return $this->item->useRawValues($raw);
	}

	public function isUsable()
	{
		return $this->item->isUsable();
	}

	public function isEquipable()
	{
		return $this->item->isEquipable();
	}

	public function onUse(Player $player)
	{

	}

	public function onEquip(Player $player)
	{

	}
}

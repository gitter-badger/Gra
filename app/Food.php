<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use HempEmpire\Contracts\Food as FoodContract;


class Food extends Model implements FoodContract
{
    protected $fillable = ['owner_id', 'owner_type', 'template_id', 'count'];
    public $timestamps = false;


    public function owner()
    {
    	return $this->morphTo();
    }

    public function template()
    {
    	return $this->belongsTo(TemplateFood::class, 'template_id');
    }


	public function isUsable()
	{
		return true;
	}

	public function isEquipable()
	{
		return false;
	}

	public function onUse(Player $player)
	{
		$health = $this->getHealth();

		if(!is_null($health))
			$player->health += $health;


		$energy = $this->getEnergy();

		if(!is_null($energy))
			$player->energy += $energy;


		if(!is_null($health) || !is_null($energy))
			return $player->save();

		return false;
	}

	public function onEquip(Player $player)
	{
		return false;
	}


    //HempEmpire\Contracts\Item
    //=====================================================================

    public function getId()
    {
    	return $this->id;
    }

	public function getName()
	{
		return $this->template->getName();
	}

	public function getTitle()
	{
		return $this->template->getTitle();
	}

	public function getDescription()
	{
		return $this->template->getDescription();
	}

	public function getImage()
	{
		return $this->template->getImage();
	}

	public function getType()
	{
		return $this->template->getType();
	}

	public function getPrice()
	{
		return $this->template->getPrice();
	}

	public function getWeight()
	{
		return $this->template->getWeight();
	}

	public function isPremium()
	{
		return $this->template->isPremium();
	}

	public function getCount()
	{
		return $this->count;
	}

	public function getTemplate()
	{
		return $this->template_id;
	}

	public function getRequirements()
	{
		return $this->template->getRequirements();
	}
	
	public function useRawValues($raw)
	{
		
	}

	public function onBuy(Player $player)
	{
		
	}

    //HempEmpire\Contracts\Food
    //=====================================================================


	public function getHealth()
	{
		return $this->template->getHealth();
	}

	public function getEnergy()
	{
		return $this->template->getEnergy();
	}
}

<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use HempEmpire\Contracts\Vehicle as VehicleContract;
use DB;


class Vehicle extends Model implements VehicleContract
{
    
    protected $fillable = ['owner_id', 'owner_type', 'template_id', 'count', 'speed', 'capacity', 'cost'];
    public $timestamps = false;
    protected $raw = false;


    public function owner()
    {
    	return $this->morphTo();
    }

    public function template()
    {
    	return $this->belongsTo(TemplateVehicle::class, 'template_id');
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

	public function isPremium()
	{
		return $this->template->isPremium();
	}

	public function getCount()
	{
		return $this->count;
	}

	public function getWeight()
	{
		return $this->template->getWeight();
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
		$this->raw = $raw;
	}

	public function isUsable()
	{
		return true;
	}

	public function onUse(Player $player)
	{
		return DB::transaction(function() use($player)
		{
			$item = $player->equipment->vehicle();

			if(isset($item))
			{

				if(!($player->equipment->takeItem($item, 1) &&
					$player->giveItem($item, 1)))
				{
					return false;
				}
			}

			return $player->equipment->giveItem($this, 1);
		});
	}

	public function onBuy(Player $player)
	{
		
	}

    //HempEmpire\Contracts\Vehicle
    //=====================================================================

	public function getSpeed()
	{
		if(is_null($this->speed) && !$this->raw)
		{
			return $this->template->getSpeed();
		}
		else
		{
			return $this->speed;
		}
	}

	public function getCost()
	{
		if(is_null($this->cost) && !$this->raw)
		{
			return $this->template->getCost();
		}
		else
		{
			return $this->cost;
		}
	}

	public function getCapacity()
	{
		if(is_null($this->capacity) && !$this->raw)
		{
			return $this->template->getCapacity();
		}
		else
		{
			return $this->capacity;
		}
	}

	public function getSubType()
	{
		return $this->template->getSubType();
	}
}

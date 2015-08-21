<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use HempEmpire\Contracts\Vehicle as VehicleContract;

class TemplateVehicle extends Model implements VehicleContract
{
	protected $fillable = ['name', 'image', 'price', 'premium', 'speed', 'cost', 'capacity', 'type', 'properties', 'weight'];
	public $timestamps = false;
    private $props;
    protected $raw = false;



    public function getPropertiesAttribute($value)
    {
    	if(empty($this->props))
    	{
    		$this->props = json_decode($value, true);
    	}

    	return $this->props;
    }

	//HempEmpire\Contracts\Item
	//=========================================
	public function getId()
	{
		return null;
	}

	public function getName()
	{
		return $this->name;
	}

	public function getTitle()
	{
		return trans('item.' . $this->name . '.name');
	}

	public function getDescription()
	{
		return trans('item.' . $this->name . '.description');
	}

	public function getImage()
	{
		return asset('images/items/vehicles/' . $this->image);
	}

	public function getType()
	{
		return 'vehicle';
	}

	public function getPrice()
	{
		return $this->price;
	}

	public function isPremium()
	{
		return $this->premium;
	}

	public function getWeight()
	{
		return $this->weight;
	}

	public function getCount()
	{
		return null;
	}

	public function getTemplate()
	{
		return $this->id;
	}

	public function getRequirements()
	{
		return new Requirements(array_get($this->properties, 'requires', []));
	}

	public function useRawValues($raw)
	{
		$this->raw = $raw;
	}

	public function isUsable()
	{
		return false;
	}

	public function onUse(Player $player)
	{
		
	}

	public function onBuy(Player $player)
	{
		
	}


	//HempEmpire\Contracts\Vehicle
	//=========================================
	public function getSpeed()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->speed;
		}
	}

	public function getCost()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->cost;
		}
	}

	public function getCapacity()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->capacity;
		}
	}

	public function getSubType()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->type;
		}
	}
}

<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use HempEmpire\Contracts\Seed as SeedContract;

class TemplateSeed extends Model implements SeedContract
{
    protected $fillable = ['name', 'image', 'premium', 'price', 'growth', 'watering', 'harvestMin', 'harvestMax', 'quality', 'properties', 'weight'];
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
    //============================================

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
		return asset('images/items/seeds/' . $this->image);
	}

	public function getType()
	{
		return 'seed';
	}

	public function getPrice()
	{
		return $this->price;
	}

	public function isPremium()
	{
		return $this->premium;
	}

	public function getCount()
	{
		return null;
	}

	public function getWeight()
	{
		return $this->weight;
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

	public function isEquipable()
	{
		return false;
	}

	public function onUse(Player $player)
	{
		return false;
	}

	public function onEquip(Player $player)
	{
		return false;
	}

    //HempEmpire\Contracts\Seed
    //============================================

	public function getGrowth()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->growth;
		}
	}

	public function getWatering()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->watering;
		}
	}

	public function getSpecies()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return str_replace('-seed', '', $this->name);
		}
	}

	public function getMinHarvest()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->harvestMin;
		}
	}

	public function getMaxHarvest()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->harvestMax;
		}
	}

	public function getQuality()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->quality;
		}
	}
}

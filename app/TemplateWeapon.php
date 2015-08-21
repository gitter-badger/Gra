<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use HempEmpire\Contracts\Weapon as WeaponContract;

class TemplateWeapon extends Model implements WeaponContract
{
    protected $fillable = ['name', 'image', 'damageMin', 'damageMax', 'critChance', 'speed', 'price', 'premium', 'type', 'properties', 'weight'];
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
    //=====================================================================

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
		return asset('images/items/weapons/' . $this->image);
	}

	public function getType()
	{
		return 'weapon';
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

	public function onUse(Player $player)
	{
		
	}

	public function onBuy(Player $player)
	{
		
	}


    //HempEmpire\Contracts\Weapon
    //=====================================================================

	public function getDamage()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return [$this->damageMin, $this->damageMax];
		}
	}

	public function getCritChance()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->critChance;
		}
	}

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

<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use HempEmpire\Contracts\Food as FoodContract;

class TemplateFood extends Model implements FoodContract
{
    protected $fillable = ['name', 'image', 'price', 'premium', 'health', 'energy', 'properties', 'weight'];
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
	//==============================================    
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
		return asset('images/items/foods/' . $this->image);
	}

	public function getType()
	{
		return 'food';
	}

	public function getPrice()
	{
		return $this->price;
	}

	public function getWeight()
	{
		return $this->weight;
	}

	public function isPremium()
	{
		return $this->premium;
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
		return true;
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




	//HempEmpire\Contracts\Food
	//============================================== 
	public function getHealth()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->health;
		}
	}

	public function getEnergy()
	{
		if($this->raw)
		{
			return null;
		}
		else
		{
			return $this->energy;
		}
	}  

}

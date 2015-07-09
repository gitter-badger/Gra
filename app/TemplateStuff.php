<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use HempEmpire\Contracts\Stuff as StuffContract;

class TemplateStuff extends Model implements StuffContract
{
    protected $fillable = ['name', 'image', 'premium', 'price', 'weight', 'quality', 'properties'];
    public $timestmaps = false;
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
		return asset('images/items/stuffs/' . $this->image);
	}

	public function getType()
	{
		return 'stuff';
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


    //HempEmpire\Contracts\Stuff
    //============================================

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

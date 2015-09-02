<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use HempEmpire\Contracts\Seed as SeedContract;


class Seed extends Model implements SeedContract
{
    protected $fillable = ['owner_id', 'owner_type', 'template_id', 'count', 'growth', 'watering', 'harvestMin', 'harvestMax', 'quality'];
    public $timestamps = false;
    protected $raw = false;


    public function owner()
    {
    	return $this->morphTo();
    }

    public function template()
    {
    	return $this->belongsTo(TemplateSeed::class, 'template_id');
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
    //=====================================================================

	public function getGrowth()
	{
		if(is_null($this->growth) && !$this->raw)
		{
			return $this->template->getGrowth();
		}
		else
		{
			return $this->growth;
		}
	}

	public function getWatering()
	{
		if(is_null($this->watering) && !$this->raw)
		{
			return $this->template->getWatering();
		}
		else
		{
			return $this->watering;
		}
	}

	public function getSpecies()
	{
		return $this->template->getSpecies();
	}

	public function getMinHarvest()
	{
		if(is_null($this->harvestMin) && !$this->raw)
		{
			return $this->template->getMinHarvest();
		}
		else
		{
			return $this->harvestMin;
		}
	}

	public function getMaxHarvest()
	{
		if(is_null($this->harvestMax) && !$this->raw)
		{
			return $this->template->getMaxHarvest();
		}
		else
		{
			return $this->harvestMax;
		}
	}

	public function getQuality()
	{
		if(is_null($this->quality) && !$this->raw)
		{
			return $this->template->getQuality();
		}
		else
		{
			return $this->quality;
		}
	}

}

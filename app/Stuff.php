<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use HempEmpire\Contracts\Stuff as StuffContract;


class Stuff extends Model implements StuffContract
{
    protected $fillable = ['owner_id', 'owner_type', 'template_id', 'count', 'quality'];
    public $timestamps = false;
    protected $raw = false;

    public function owner()
    {
    	return $this->morphTo();
    }

    public function template()
    {
    	return $this->belongsTo(TemplateStuff::class, 'template_id');
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

	public function getWeight()
	{
		return $this->template->getWeight();
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

    //HempEmpire\Contracts\Stuff
    //=====================================================================

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

<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use HempEmpire\Contracts\Weapon as WeaponContract;
use DB;


class Weapon extends Model implements WeaponContract
{
    protected $fillable = ['owner_id', 'owner_type', 'template_id', 'count'];
    public $timestamps = false;


    public function owner()
    {
    	return $this->morphTo();
    }

    public function template()
    {
    	return $this->belongsTo(TemplateWeapon::class, 'template_id');
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

	public function isUsable()
	{
		return false;
	}

	public function isEquipable()
	{
		return true;
	}

	public function onUse(Player $player)
	{
		return false;
	}

	public function onEquip(Player $player)
	{
		return DB::transaction(function() use($player)
		{

			$item = $player->equipment->weapon();


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

    //HempEmpire\Contracts\Weapon
    //=====================================================================

	public function getDamage()
	{
		return $this->template->getDamage();
	}

	public function getCritChance()
	{
		return $this->template->getCritChance();
	}

	public function getSpeed()
	{
		return $this->template->getSpeed();
	}

	public function getSubType()
	{
		return $this->template->getSubType();
	}
}

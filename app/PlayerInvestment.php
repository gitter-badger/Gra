<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use Config;

class PlayerInvestment extends Model
{
    protected $fillable = ['player_id', 'location_place_id', 'investment_id', 'money', 'capacityLevel', 'incomeLevel', 'lastUpdate', 'managerId', 'managerExpires', 'managerMoney'];
    protected $with = ['investment'];
    public $timestamps = false;



    public function player()
    {
    	return $this->belongsTo(Player::class);
    }

    public function place()
    {
    	return $this->belongsTo(LocationPlace::class);
    }

    public function investment()
    {
    	return $this->belongsTo(Investment::class);
    }

    public function getTimeAttribute()
    {
        return round($this->investment->time * $this->world->timeScale);
    }


    public function getLevelAttribute()
    {
    	return $this->capacityLevel + $this->incomeLevel - 1;
    }

    public function getUpgradeCostAttribute()
    {
    	return $this->level * $this->investment->upgradeCost;
    }

    public function getIncomeMaxLevelAttribute()
    {
    	return $this->investment->maxIncome;
    }

    public function getCapacityMaxLevelAttribute()
    {
    	return $this->investment->maxCapacity;
    }

    public function getIncomeAttribute()
    {
    	return $this->investment->baseIncome + $this->incomeLevel * $this->investment->incomePerLevel;
    }

    public function getCapacityAttribute()
    {
    	return $this->investment->baseCapacity + $this->capacityLevel * $this->investment->capacityPerLevel;
    }

    public function getNextUpdateAttribute()
    {
    	return $this->lastUpdate + $this->time;
    }

    public function getMoneyAttribute()
    {
    	$this->updateMoney();
    	return $this->attributes['money'];
    }

    private $_moneyUpdated = false;
    public function updateMoney($save = true)
    {
    	if(!$this->_moneyUpdated)
    	{
    		$now = time();

            if($this->bought)
            {
                $interval = max($now - $this->lastUpdate, 0);
                $ticks = floor($interval / $this->time);

                for($i = 0; $i < $ticks; ++$i)
                {
                    $left = $this->capacity - $this->attributes['money'];
                    $this->attributes['money'] += min($this->income, $left);
                    $this->lastUpdate += $this->time;

                    if($this->hasManager() && $this->lastUpdate <= $this->managerExpires)
                       $this->managerMoney += max($this->income - $left, 0) * (1.0 - $this->getManagerCost()); 
                }

                $this->_moneyUpdated = true;
            }
            else
            {
                $this->lastUpdate = $now;
            }

            if($save)
            {
                return $this->save();
            }
    	}
        return true;
    }



    public function hasManager()
    {
        return !is_null($this->managerId) && $this->managerId != 0;
    }

    public function getManager()
    {
        if($this->hasManager())
        {
            return Config::get('managers.' . $this->managerId);
        }
        else
        {
            return null;
        }
    }

    public function getManagerCost()
    {
        $manager = $this->getManager();

        if(is_null($manager))
        {
            return 0;
        }
        else
        {
            return $manager['cost'];
        }
    }



    public function getManagerStart()
    {
        $manager = $this->getManager();


        if(is_null($manager))
        {
            return null;
        }
        else
        {
            return $this->managerExpires - round($manager['duration'] * $this->world->timeScale);
        }
    }



    public function getManagerEnd()
    {
        $manager = $this->getManager();


        if(is_null($manager))
        {
            return null;
        }
        else
        {
            return $this->managerExpires;
        }
    }
}

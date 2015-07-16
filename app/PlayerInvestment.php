<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use Config;

class PlayerInvestment extends Model
{
    protected $fillable = ['player_id', 'location_place_id', 'investment_id', 'money', 'capacityLevel', 'incomeLevel', 'lastUpdate'];
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
        if(Config::get('app.debug', false))
        {
            return floor($this->investment->time / 360);
        }
        else
        {
            return $this->investment->time;
        }
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
                $this->lastUpdate += $this->time * $ticks;
                $this->attributes['money'] = min($this->attributes['money'] + $ticks * $this->income, $this->capacity);
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
}

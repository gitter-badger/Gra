<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

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
    	return $this->lastUpdate + $this->investment->time;
    }

    public function getMoneyAttribute()
    {
    	$this->updateMoney();
    	return $this->attributes['money'];
    }

    private $_moneyUpdated = false;
    public function updateMoney()
    {
    	if(!$this->_moneyUpdated)
    	{
    		$now = time();

    		$interval = max($now - $this->lastUpdate, 0);
    		$ticks = floor($interval / $this->investment->time);
    		$this->lastUpdate += $this->investment->time * $ticks;
    		$this->attributes['money'] = min($this->attributes['money'] + $ticks * $this->income, $this->capacity);
    		$this->_moneyUpdated = true;
    		$this->save();
    	}
    }
}

<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use Config;


class Investment extends Model
{
    protected $fillable = ['baseIncome', 'incomePerLevel', 'baseCapacity', 'capacityPerLevel', 'upgradeCost', 'maxIncome', 'maxCapacity', 'time'];
    public $timestamps = false;



    public function investments()
    {
        return $this->hasMany(PlayerInvestment::class);
    }


    public function getTimeAttribute($value)
    {
    	if(Config::get('app.debug', false))
    	{
    		return floor($value / 360);
    	}
    	else
    	{
    		return $value;
    	}
    }
}

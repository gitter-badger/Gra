<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    protected $fillable = ['name', 'group_id', 'duration', 'cost', 'requires', 'rewards'];
    public $timestamps = false;


    public function group()
    {
    	return $this->belongsTo(WorkGroup::class, 'group_id');
    }


    private $_costs = null;
    public function getCostsAttribute($value)
    {
    	if(is_null($this->_costs))
    	{
    		$this->_costs = json_decode($value, true);
    	}

    	return $this->_costs;
    }

    private $_requires = null;
    public function getRequiresAttribute($value)
    {
    	if(is_null($this->_requires))
    	{
    		$this->_requires = json_decode($value, true);
    	}

    	return $this->_requires;
    }

    private $_rewards = null;
    public function getRewardsAttribute($value)
    {
    	if(is_null($this->_rewards))
    	{
    		$this->_rewards = json_decode($value, true);
    	}

    	return $this->_rewards;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getTitle()
    {
        return trans('work.' . $this->name . '.name');
    }

    public function getDescription()
    {
        return trans('work.' . $this->name . '.description');
    }



    public function getCosts()
    {
    	return new Costs($this->costs);
    }

    public function getRewards()
    {
    	return new Rewards($this->rewards);
    }

    public function getRequirements()
    {
    	return new Requirements($this->requires);
    }
}

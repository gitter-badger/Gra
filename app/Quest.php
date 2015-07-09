<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Quest extends Model
{
    protected $fillable = ['name', 'group_id', 'requires', 'rewards'];
    public $timestamps = false;
    private $_requires;
    private $_rewards;


    public function group()
    {
    	return $this->belongsTo(QuestGroup::class, 'group_id');
    }


    public function getRequiresAttribute($value)
    {
    	if(empty($this->_requires))
    	{
    		$this->_requires = json_decode($value);
    	}
    	return $this->_requires;
    }

    public function getRewardsAttribute($value)
    {
    	if(empty($this->_rewards))
    	{
    		$this->_rewards = json_decode($value);
    	}
    	return $this->_rewards;
    }


    public function getRewards()
    {
    	return new Rewards($this->rewards);
    }

    public function getRequirements()
    {
    	return new Requirements($this->requires);
    }

    public function getName()
    {
        return $this->name;
    }

    public function getTitle()
    {
        return trans('quest.' . $this->name . '.name');
    }

    public function getDescription()
    {
        return trans('quest.' . $this->name . '.description');
    }

    public function getCompleted()
    {
        return trans('quest.' . $this->name . '.complete');
    }
}

<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Quest extends Model
{
    protected $fillable = ['name', 'requires', 'rewards', 'objectives', 'repeatable', 'auto', 'breakable', 'daily', 'accept'];
    public $timestamps = false;
    private $_requires;
    private $_rewards;
    private $_accept;
    private $_objectives;




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

    public function getAcceptAttribute($value)
    {
        if(empty($this->_accept))
        {
            $this->_accept = json_decode($value);
        }
        return $this->_accept;
    }

    public function getObjectivesAttribute($value)
    {
        if(empty($this->_objectives))
        {
            $this->_objectives = json_decode($value);
        }
        return $this->_objectives;
    }


    public function getRewards()
    {
    	return new Rewards($this->rewards);
    }

    public function getRequirements()
    {
    	return new Requirements($this->requires);
    }

    public function getAccept()
    {
        //dd($this->accept);
        return new Rewards($this->accept);
    }

    public function getObjectives()
    {
        return new Objectives($this->objectives);
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

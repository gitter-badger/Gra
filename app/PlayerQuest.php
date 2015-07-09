<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class PlayerQuest extends Model
{
    protected $fillable = ['quest_id', 'player_id', 'active', 'done'];
    public $timestamps = false;


    public function quest()
    {
    	return $this->belongsTo(Quest::class);
    }

    public function player()
    {
    	return $this->belongsTo(Player::class);
    }

    public static function boot()
    {
    	parent::boot();


    	static::creating(function(PlayerQuest $quest)
    	{
    		$quest->active = true;
    		$quest->done = false;
    	});

    	static::updating(function(PlayerQuest $quest)
    	{
    		if($quest->active && $quest->done)
    		{
    			$quest->active = false;
    			$quest->done = true;


    			$quest->quest->getRewards()->give($quest->player);
    		}
    	});
    }

    public function getName()
    {
        return $this->quest->getName();
    }

    public function getTitle()
    {
        return $this->quest->getTitle();
    }

    public function getDescription()
    {
        return $this->quest->getDescription();
    }

    public function getCompleted()
    {
        return $this->quest->getComplete();
    }
}

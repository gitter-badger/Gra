<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = ['player_id', 'object'];
    public $timestamps = true;
    private $_object;



    public function player()
    {
    	return $this->belongsTo(Player::class);
    }


    public function getObjectAttribute($value)
    {
    	if(empty($this->_object))
    	{
    		$this->_object = unserialize($value);
    	}

    	return $this->_object;
    }

    public function __call($name, $args)
    {
    	$object = $this->object;


    	if(!is_null($object) && method_exists($object, $name))
    	{
    		return call_user_func_array([$object, $name], func_get_args());
    	}
    	else
    	{
    		return null;
    	}
    }
}

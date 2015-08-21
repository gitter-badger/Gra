<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Npc extends Model
{
    protected $fillable = ['name', 'quests', 'image'];
    public $timestamps = false;



    private $_quests;
    public function getQuestsAttribute($value)
    {
    	if(empty($this->_quests))
    	{
    		$this->_quests = json_decode($value);
    	}

    	return $this->_quests;
    }

    public function getImage()
    {
        return asset('images/npc/' . $this->image);
    }


}

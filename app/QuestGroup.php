<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class QuestGroup extends Model
{
    protected $fillable = ['name'];
    public $timestamps = false;


    public function quests()
    {
    	return $this->hasMany(Quest::class, 'group_id');
    }


    public function getName()
    {
    	return $this->name;
    }
}

<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class WorkGroup extends Model
{
    protected $fillable = ['name'];
    public $timestamps = false;



    public function works()
    {
    	return $this->hasMany(Work::class, 'group_id');
    }


    public function getName()
    {
    	return $this->name;
    }

    public function getTitle()
    {
    	return trans('work-group.' . $this->name);
    }
}

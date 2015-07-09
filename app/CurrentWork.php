<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class CurrentWork extends Model
{
    protected $fillable = ['work_id', 'current_work_group_id', 'active', 'done'];
    public $timestamps = false;


    public function work()
    {
    	return $this->belongsTo(Work::class);
    }

    public function group()
    {
    	return $this->belongsTo(CurrentWokrGroup::class);
    }
}

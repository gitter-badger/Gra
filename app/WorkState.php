<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class WorkState extends Model
{
    protected $fillable = ['manager_id', 'work_id', 'active', 'done', 'counter', 'order'];
    public $timestamps = false;


    public function manager()
    {
    	return $this->belongsTo(WorkManager::class, 'manager_id');
    }

    public function work()
    {
    	return $this->belongsTo(Work::class);
    }
}

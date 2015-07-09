<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Timer extends Model
{
    protected $fillable = ['owner_id', 'owner_type', 'start', 'end', 'name'];
    public $timestamps = false;


    public function owner()
    {
    	return $this->morphTo();
    }




    public function getActiveAttribute()
    {
    	$now = time();
    	return $this->start <= $now && $this->end > $now;
    }

    public function scopeActive($query)
    {
    	$now = time();
    	return $query->where('start', '<=', $now)
    		->where('end', '>', $now);
    }

}

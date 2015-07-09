<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class CurrentWorkGroup extends Model
{
    protected $fillable = ['player_id', 'work_group_id', 'location_place_id', 'lastUpdated'];
    public $timestamps = false;


    public function player()
    {
    	return $this->belongsTo(Player::class);
    }

    public function group()
    {
    	return $this->belongsTo(WorkGroup::class);
    }

    public function place()
    {
    	return $this->belongsTo(LocationPlace::class, 'location_place_id');
    }

    public function works()
    {
    	return $this->hasMany(CurrentWork::class);
    }


}

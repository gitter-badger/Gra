<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Plantation extends Model
{
    protected $fillable = ['player_id', 'location_place_id', 'light', 'ground'];
    protected $with = ['slots'];
    public $timestamps = false;


    public function player()
    {
    	return $this->belongsTo(Player::class);
    }

    public function place()
    {
    	return $this->belognsTo(LocationPlace::class, 'location_place_id');
    }

    public function slots()
    {
    	return $this->hasMany(PlantationSlot::class);
    }
}

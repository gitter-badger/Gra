<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    protected $fillable = ['location_place_id', 'player_id', 'money'];
    public $timestamps = false;


    public function place()
    {
    	return $this->belongsTo(LocationPlace::class);
    }

    public function player()
    {
    	return $this->belongsTo(Player::class);
    }
}

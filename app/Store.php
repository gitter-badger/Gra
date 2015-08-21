<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
	use ItemContainer;

    protected $fillable = ['player_id', 'location_place_id', 'level', 'premiumLevel', 'capacity'];
    public $timestamps = false;

    public function player()
    {
    	return $this->belongsTo(Player::class);
    }


    public function getCapacity()
    {
    	return $this->capacity;
    }
}

<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class PlayerEquipment extends Model
{
	use ItemContainer;

    protected $fillable = ['player_id'];
    public $timestamps = false;


    public function player()
    {
    	return $this->belongsTo(Player::class);
    }



    public function weapon()
    {
    	return $this->weapons()->where('count', '>', 0)->first();
    }

    public function armor()
    {
    	return $this->armors()->where('count', '>', 0)->first();
    }

    public function vehicle()
    {
    	return $this->vehicles()->where('count', '>', 0)->first();
    }
}

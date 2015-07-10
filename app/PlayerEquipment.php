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
}

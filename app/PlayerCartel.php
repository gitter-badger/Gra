<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class PlayerCartel extends Model
{
    protected $fillable = ['player_id', 'cartel_id', 'respect'];
    public $timestamps = false;




    public function player()
    {
    	return $this->belongsTo(Player::class);
    }

    public function cartel()
    {
    	return $this->belongsTo(Cartel::class);
    }


    public function getReputationAttribute()
    {
        return Reputation::fromRespect($this->respect);
    }
}

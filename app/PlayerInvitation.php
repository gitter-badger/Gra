<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class PlayerInvitation extends Model
{
    protected $fillable = ['player_id', 'gang_id'];
    public $timestamps = true;



    public function player()
    {
    	return $this->belongsTo(Player::class);
    }

    public function gang()
    {
    	return $this->belongsTo(Gang::class);
    }

}

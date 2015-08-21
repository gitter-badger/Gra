<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class PlayerTalent extends Model
{
    protected $fillable = ['player_id', 'name'];
    public $timestamps = false;

    public function player()
    {
    	return $this->belongsTo(Player::class);
    }
}

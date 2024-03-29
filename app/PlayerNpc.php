<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class PlayerNpc extends Model
{
    protected $fillable = ['npc_id', 'player_id', 'location_place_id', 'quest_id'];
    public $timestamps = false;



    public function npc()
    {
    	return $this->belongsTo(Npc::class);
    }

    public function player()
    {
    	return $this->belongsTo(Player::class);
    }

    public function place()
    {
    	return $this->belongsTo(LocationPlace::class, 'location_place_id');
    }


    public function quest()
    {
    	return $this->belongsTo(Quest::class);
    }

    public function getImage()
    {
        return $this->npc->getImage();
    }


}

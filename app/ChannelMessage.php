<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class ChannelMessage extends Model
{
    protected $fillable = ['channel_id', 'player_id', 'message'];
    protected $visible = ['author', 'avatar', 'message', 'time'];
    protected $appends = ['author', 'avatar', 'time'];
    public $timestamps = true;



    public function channel()
    {
    	return $this->belongsTo(Channel::class);
    }

    public function player()
    {
    	return $this->belongsTo(Player::class);
    }





    public function getAuthorAttribute()
    {
    	return $this->player->name;
    }

    public function getTimeAttribute()
    {
    	return strtotime($this->created_at);
    }

    public function getAvatarAttribute()
    {
    	return $this->player->avatar;
    }
}

<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class PlayerReference extends Model
{
	protected $fillable = ['player_id', 'request_ip'];
	public $timestamps = true;


	public function player()
	{
		return $this->belongsTo(Player::class);
	}


    public function getRequestIpAttribute($value)
    {
        return inet_ntop($value);
    }

    public function setRequestIpAttribute($value)
    {
        $this->attributes['request_ip'] = inet_pton($value);
    }

}

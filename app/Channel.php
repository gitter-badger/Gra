<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    protected $fillable = ['owner_id', 'owner_type'];
    public $timestamps = false;


    public function owner()
    {
    	return $this->morphTo();
    }

    public function messages()
    {
    	return $this->hasMany(ChannelMessage::class);
    }
}

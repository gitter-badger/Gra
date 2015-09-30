<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Cartel extends Model
{
    protected $fillable = ['name'];
    public $timestamps = false;



    public function players()
    {
    	return $this->hasMany(PlayerCartel::class);
    }
}

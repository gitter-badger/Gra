<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Gang extends Model
{
    protected $fillable = ['world_id', 'name', 'level', 'money'];
    public $timestamps = true;


    public function world()
    {
    	return $this->belongsTo(World::class);
    }

    public function members()
    {
    	return $this->hasMany(GangMember::class);
    }
}
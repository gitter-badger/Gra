<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Market extends Model
{
    protected $fillable = ['location_place_id', 'world_id'];
    public $timestamps = false;


    public function place()
    {
    	return $this->belongsTo(LocationPlace::class, 'location_place_id');
    }

    public function world()
    {
    	return $this->belongsTo(World::class);
    }

    public function items()
    {
    	return $this->hasMany(MarketItem::class);
    }
}

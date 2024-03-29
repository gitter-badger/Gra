<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class GangStore extends Model
{
	use ItemContainer;

    protected $fillable = ['gang_id', 'location_place_id', 'level', 'premiumLevel', 'capacity'];
    public $timestamps = false;

    public function gang()
    {
    	return $this->belongsTo(Gang::class);
    }


    public function getCapacity()
    {
    	return $this->capacity;
    }
}

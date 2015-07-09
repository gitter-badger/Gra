<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class PlantationSlot extends Model
{
    protected $fillable = ['plantation_id', 'species', 'watering', 'harvestMin', 'harvestMax', 'qualityMin', 'qualityMax', 'start', 'end', 'lastWatered', 'isEmpty'];
    public $timestamps = false;


    public function plantation()
    {
    	return $this->belongsTo(Plantation::class);
    }


    public function getIsReadyAttribute()
    {
        $now = time();

    	return $this->end <= $now && $this->nextWatering >= $this->end;
    }

    public function getNextWateringAttribute()
    {
        return $this->lastWatered + $this->watering + 1;
    }
}

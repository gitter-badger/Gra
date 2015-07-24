<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Gang extends Model
{
    protected $fillable = ['world_id', 'name', 'level', 'money', 'respect'];
    public $timestamps = true;


    public function world()
    {
    	return $this->belongsTo(World::class);
    }

    public function members()
    {
    	return $this->hasMany(GangMember::class);
    }

    public function invitations()
    {
        return $this->hasMany(PlayerInvitation::class);
    }


    public function getMembersCountAttribute()
    {
        return $this->members()->count() + $this->invitations()->count();
    }


    public function getUpgradeCostAttribute()
    {
        return round(exp($this->level / 10) * 100);
    }

    public function getMembersLimitAttribute()
    {
        return floor($this->level / 10) + 4;
    }
}

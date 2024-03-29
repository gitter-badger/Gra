<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use Config;

class Gang extends Model
{
    protected $fillable = ['world_id', 'name', 'attackLevel', 'defenseLevel', 'accomodationLevel', 'money', 'respect', 'startAttack', 'endAttack', 'action',
        'avatar', 'premium', 'publicText', 'privateText'];

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

    public function logs()
    {
        return $this->hasMany(GangLog::class);
    }

    public function channel()
    {
        return $this->morphOne(Channel::class, 'owner');
    }






    public function newLog($action)
    {
        $log = new GangLog;
        $log->gang_id = $this->id;
        $log->action = $action;
        $log->data = serialize([]);

        return $log;
    }


    public function battleIsComming()
    {
        $now = time();
        return $this->endAttack > $now;
    }




    public function getMembersCountAttribute()
    {
        return $this->members()->count() + $this->invitations()->count();
    }


    public function getLevelAttribute()
    {
        $q = $this->members()->leftJoin('players', 'gang_members.player_id', '=', 'players.id');

        return round($q->sum('level') / $q->count());
    }




    public function getAccomodationUpgradeCostAttribute()
    {
        return round(exp($this->accomodationLevel) * Config::get('gang.upgrade.accomodation.cost'));
    }

    public function getAccomodationMaxLevelAttribute()
    {
        return Config::get('gang.upgrade.accomodation.maxLevel');
    }




    public function getAttackUpgradeCostAttribute()
    {
        return round(exp($this->attackLevel) * Config::get('gang.upgrade.attack.cost'));
    }

    public function getAttackMaxLevelAttribute()
    {
        return Config::get('gang.upgrade.attack.maxLevel');
    }




    public function getDefenseUpgradeCostAttribute()
    {
        return round(exp($this->defenseLevel) * Config::get('gang.upgrade.defense.cost'));
    }

    public function getDefenseMaxLevelAttribute()
    {
        return Config::get('gang.upgrade.defense.maxLevel');
    }

    public function getAvatarAttribute($value)
    {
        return asset('/images/gangs/' . $this->id . '/' . $value);
    }



    public function getMembersLimitAttribute()
    {
        return $this->accomodationLevel + 3;
    }
}

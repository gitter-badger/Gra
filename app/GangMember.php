<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class GangMember extends Model
{
	const PERMISSION_INVITE			= 1 << 0;
	const PERMISSION_KICK			= 1 << 1;
	const PERMISSION_DEPOSIT_MONEY	= 1 << 2;
	const PERMISSION_WITHDRAW_MONEY	= 1 << 3;
	const PREMISSION_PUT_ITEM		= 1 << 4;
	const PERMISSION_TAKE_ITEM		= 1 << 5;
	const PERMISSION_UPGRADE		= 1 << 6;
	const PERMISSION_ATTACK			= 1 << 7;

    const PERMISSIONS_ALL           = PREMISSION_INVIDE | PERMISSION_KICK | PERMISSION_DEPOSIT_MONEY | 
                                        PERMISSION_WITHDRAW_MONEY | PERMISSION_PUT_ITEM | PERMISSION_TAKE_ITEM |
                                        PERMISSION_UPGRADE | PERMISSION_ATTACK;


    protected $fillable = ['gang_id', 'player_id', 'role', 'premissions'];
    public $timestamps = false;



    public function gang()
    {
    	return $this->belongsTo(Gang::class);
    }


    public function player()
    {
    	return $this->belongsTo(Player::class);
    }


    public function can($permission)
    {
    	return ($this->permissions & $permission) == $permission;
    }

    public function allow($permission)
    {
    	$this->permissions |= $permission;
    }

    public function deny($permission)
    {
    	$this->permission &= ~$permission;
    }


}

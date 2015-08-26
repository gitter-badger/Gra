<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class GangMember extends Model
{
	const PERMISSION_INVITE			    = 1 << 0;
	const PERMISSION_KICK			    = 1 << 1;
	const PERMISSION_DEPOSIT_MONEY	    = 1 << 2;
	const PERMISSION_WITHDRAW_MONEY	    = 1 << 3;
	const PERMISSION_PUT_ITEM		    = 1 << 4;
	const PERMISSION_TAKE_ITEM		    = 1 << 5;
	const PERMISSION_UPGRADE		    = 1 << 6;
	const PERMISSION_ATTACK			    = 1 << 7;
    const PERMISSION_PROMOTE            = 1 << 8;
    const PERMISSION_DEMOTE             = 1 << 9;
    const PERMISSION_CONTRIBUTION       = 1 << 10;
    const PERMISSION_LOG                = 1 << 11;
    const PERMISSION_CHANGE_PUBLIC      = 1 << 12;
    const PERMISSION_CHANGE_PRIVATE     = 1 << 13;
    const PERMISSION_CHANGE_AVATAR      = 1 << 14;
    const PERMISSION_CHAT_READ          = 1 << 15;
    const PERMISSION_CHAT_WRITE         = 1 << 16;
    const PERMISSION_CHAT_MUTE          = 1 << 17;


    const PERMISSIONS_NEWBIE        = self::PERMISSION_DEPOSIT_MONEY | self::PERMISSION_PUT_ITEM | self::PERMISSION_CHAT_READ;
    const PERMISSIONS_MEMBER        = self::PERMISSIONS_NEWBIE  | self::PERMISSION_TAKE_ITEM | self::PERMISSION_CHAT_WRITE;
    const PERMISSIONS_OFFICER       = self::PERMISSIONS_MEMBER | self::PERMISSION_INVITE | self::PERMISSION_KICK | self::PERMISSION_WITHDRAW_MONEY | self::PERMISSION_UPGRADE | 
        self::PERMISSION_ATTACK | self::PERMISSION_CONTRIBUTION | self::PERMISSION_LOG | self::PERMISSION_CHANGE_PRIVATE | self::PERMISSION_CHAT_MUTE;
    const PERMISSIONS_BOSS          = self::PERMISSIONS_OFFICER | self::PERMISSION_PROMOTE | self::PERMISSION_DEMOTE | self::PERMISSION_CHANGE_PUBLIC | self::PERMISSION_CHANGE_AVATAR;



    protected $fillable = ['gang_id', 'player_id', 'role', 'joins', 'paid', 'muted'];
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

    public function getPermissionsAttribute()
    {
        switch($this->role)
        {
            case 'newbie':
                return self::PERMISSIONS_NEWBIE;
            case 'member':
                return self::PERMISSIONS_MEMBER;
            case 'officer':
                return self::PERMISSIONS_OFFICER;
            case 'boss':
                return self::PERMISSIONS_BOSS;
            default:
                return 0;
        }
    }


    public function canModify(GangMember $member)
    {
        if($this->id == $member->id)
        {
            return false;
        }
        elseif($this->role == 'member')
        {
            return false;
        }
        elseif($this->role == 'officer')
        {
            return $member->role == 'member';
        }
        elseif($this->role == 'boss')
        {
            return true;
        }

    }

    public function canBePromoted()
    {
        if($this->role == 'boss' || $this->role == 'officer')
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    public function canBeDemoted()
    {
        if($this->role == 'boss' || $this->role == 'newbie')
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    public function promote()
    {
        switch($this->role)
        {
            case 'newbie':
                $this->role = 'member';
                break;

            case 'member':
                $this->role = 'officer';
                break;

            case 'officer':
                break;

            case 'boss':
                break;
        }
    }

    public function demote()
    {
        switch($this->role)
        {
            case 'newbie':
                break;

            case 'member':
                $this->role = 'newbie';
                break;

            case 'officer':
                $this->role = 'member';
                break;

            case 'boss':
                break;
        }
    }


}

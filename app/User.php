<?php

namespace HempEmpire;

use Illuminate\Auth\Authenticatable;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['email', 'password', 'registration_ip', 'premiumPoints', 'premiumStart', 'premiumEnd', 'admin', 'token', 'verified', 'fb_id', 'language', 
        'banStart', 'banEnd', 'banReason'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token', 'admin'];





    public function getRegistrationIpAttribute($value)
    {
        return inet_ntop($value);
    }

    public function setRegistrationIpAttribute($value)
    {
        $this->attributes['registration_ip'] = inet_pton($value);
    }




    public function players()
    {
        return $this->hasMany(Player::class);
    }

    public function tutorials()
    {
        return $this->hasMany(UserTutorial::class);
    }



    public function getIsPremiumAttribute()
    {
        $now = time();

        return $this->admin || (!is_null($this->premiumStart) && !is_null($this->premiumEnd) && 
                    $this->premiumStart < $now && $this->premiumEnd >= $now);
    }

    public function getIsBannedAttribute()
    {
        return !is_null($this->banEnd) && $this->banEnd > time();
    }
}

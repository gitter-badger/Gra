<?php

namespace HempEmpire;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract
{
    use Authenticatable, CanResetPassword;

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
    protected $fillable = ['name', 'email', 'password', 'registration_ip', 'premiumPoints', 'premiumStart', 'premiumEnd', 'admin'];

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
        return $this->hasMany('HempEmpire\Player');
    }



    public function getIsPremiumAttribute()
    {
        $now = time();

        return $this->admin || (!is_null($this->premiumStart) && !is_null($this->premiumEnd) && 
                    $this->premiumStart < $now && $this->premiumEnd >= $now);
    }
}

<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class UserTutorial extends Model
{
    protected $fillable = ['user_id', 'name', 'stage', 'active'];
    public $timestamps = false;
    protected $visible = ['name', 'stage', 'active', 'title', 'description'];
    protected $appends = ['title', 'description'];


    public function user()
    {
    	return $this->belongsTo(User::class);
    }


    public function getTitleAttribute()
    {
    	return trans('tutorial.' . $this->name . '.title');
    }

    public function getDescriptionAttribute()
    {
    	return trans('tutorial.' . $this->name . '.description');
    }
}

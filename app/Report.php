<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['player_id', 'type', 'data', 'readed', 'notified', 'date'];
    protected $visible = ['id', 'title', 'content', 'date'];
    protected $appends = ['title', 'content'];
    public $timestamps = false;
    private $_data;
    private $_dataChanged = false;


    public function player()
    {
    	return $this->belongsTo(Player::class);
    }

    protected function loadData()
    {
        if(empty($this->_data))
        {
            if(isset($this->attributes['data']))
            {
                $this->_data = unserialize($this->attributes['data']);
            }
            else
            {
                $this->_data = [];
            }
        }
    }

    public function getDataAttribute()
    {
        $this->loadData();
    	return $this->_data;
    }

    public function setDataAttribute($value)
    {
        $this->_data = $value;
        $this->_dataChanged = true;
    }

    public function send()
    {
        if($this->_dataChanged)
        {
            $this->attributes['data'] = serialize($this->data);
            $this->_dataChanged = false;
        }
        return $this->save();
    }

    public function param($name, $value)
    {
        $this->loadData();
        $this->_data[$name] = $value;
        $this->_dataChanged = true;
        return $this;
    }



    public function getTitleAttribute()
    {
    	return trans('report.' . $this->type . '.title', $this->data);
    }

    public function getContentAttribute()
    {
        //dd($this->data);
    	return trans('report.' . $this->type . '.content', $this->data);
    }

    public function scopeUnreaded($query)
    {
    	return $query->where('readed', '=', false);
    }

    public function scopeReaded($query)
    {
    	return $query->where('readed', '=', true);
    }
}

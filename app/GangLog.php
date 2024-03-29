<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class GangLog extends Model
{
    protected $fillable = ['action', 'gang_id', 'player_id', 'data', 'action'];
    public $timestamps = true;
    private $_data;





    public function gang()
    {
    	return $this->belongsTo(Gang::class);
    }

    public function player()
    {
    	return $this->belongsTo(Player::class);
    }


    private function loadData()
    {
    	if(empty($this->_data))
    	{
    		$this->_data = unserialize($this->data);
    	}
    }

    public function getData()
    {
    	$this->loadData();
    	return $this->_data;
    }


    public function getVar($name, $default = null)
    {
    	$this->loadData();

    	return array_get($this->_data, $name, $default);
    }

    public function setVar($name, $value)
    {
    	$this->loadData();

    	array_set($this->_data, $name, $value);
    }

    public function param($name, $value)
    {
    	$this->setVar($name, $value);
    	return $this;
    }

    public function subject(Player $player)
    {
    	$this->player_id = $player->id;
    	return $this;
    }


    public function save(array $attributes = [])
    {
    	$this->loadData();
    	$this->data = serialize($this->_data);

    	return parent::save($attributes);
    }




    protected function renderDate()
    {
    	return '[' . $this->created_at . ']';
    }

    protected function renderPlayer()
    {
    	if(is_null($this->player))
    	{
    		return '';
    	}
    	else
    	{
    		return '<strong>' . $this->player->name . '</strong>';
    	}
    }

    protected function renderText()
    {
    	return trans('gang-log.' . $this->action, $this->getData());
    }



    public function render()
    {
    	return '<p>' . $this->renderDate() . ' ' . $this->renderPlayer() . ': ' . $this->renderText() . '</p>';
    }
}

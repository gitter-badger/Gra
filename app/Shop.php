<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;



class Shop extends Model
{
    use ItemContainer;
    

    protected $fillable = ['template_id', 'player_id', 'location_place_id', 'lastVisited'];
    public $timestamps = false;



    public function template()
    {
    	return $this->belongsTo(TemplateShop::class, 'template_id');
    }

    public function player()
    {
    	return $this->belongsTo(Player::class);
    }
}

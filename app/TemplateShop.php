<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class TemplateShop extends Model
{
    protected $fillable = ['name'];
    public $timestamps = false;


    public function deliveries()
    {
    	return $this->hasMany(TemplateShopDelivery::class, 'shop_id');
    }
}

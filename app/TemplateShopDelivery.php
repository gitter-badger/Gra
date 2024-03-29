<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class TemplateShopDelivery extends Model
{
    protected $fillable = ['shop_id', 'item_id', 'item_type', 'count'];
    protected $with = ['item'];
    public $timestamps = false;


    public function shop()
    {
    	return $this->belongsTo(TemplateShop::class, 'shop_id');
    }

    public function item()
    {
    	return $this->morphTo();
    }
}

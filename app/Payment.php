<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['payment_id', 'user_id', 'service', 'operator', 'success', 'price', 'currency', 'amount'];


    public function user()
    {
    	return $this->belongsTo(User::class);
    }
}

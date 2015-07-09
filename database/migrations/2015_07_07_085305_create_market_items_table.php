<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMarketItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('market_items', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('market_id')->unsigned();
            $table->integer('player_id')->unsigned();
            $table->integer('price')->unsigned();
            $table->morphs('item');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('market_items');
    }
}

<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stores', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('player_id')->unsigned();
            $table->integer('location_place_id')->unsigned();

            $table->integer('level')->unsigned();
            $table->integer('premiumLevel')->unsigned();
            $table->integer('capacity')->unsigned();



            $table->foreign('player_id')->references('id')->on('players');
            $table->foreign('location_place_id')->references('id')->on('location_places');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('stores');
    }
}

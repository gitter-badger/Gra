<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShopsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shops', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('template_id')->unsigned();
            $table->integer('player_id')->unsigned();
            $table->integer('location_place_id')->unsigned();
            $table->integer('lastVisited')->unsigned()->nullable();
            $table->integer('lastReseted')->unsigned()->nullable();

            $table->foreign('template_id')->references('id')->on('template_shops');
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
        Schema::drop('shops');
    }
}

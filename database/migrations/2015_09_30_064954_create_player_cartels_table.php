<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlayerCartelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('player_cartels', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('player_id')->unsigned();
            $table->integer('cartel_id')->unsigned();
            $table->integer('respect');


            $table->foreign('player_id')->references('id')->on('players');
            $table->foreign('cartel_id')->references('id')->on('cartels');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('player_cartels');
    }
}

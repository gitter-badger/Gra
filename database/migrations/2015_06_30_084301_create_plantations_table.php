<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlantationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plantations', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('player_id')->unsigned();
            $table->integer('location_place_id')->unsigned();

            $table->float('light');
            $table->float('ground');



            $table->foreign('player_id')->references('id')->on('players')->onDelete('cascade');
            $table->foreign('location_place_id')->references('id')->on('location_places')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('plantations');
    }
}

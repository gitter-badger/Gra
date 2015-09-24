<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMarketsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('markets', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('location_place_id')->unsigned();
            $table->integer('world_id')->unsigned();



            $table->foreign('location_place_id')->references('id')->on('location_places')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('world_id')->references('id')->on('worlds')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('markets');
    }
}

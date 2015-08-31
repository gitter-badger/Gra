<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGangStoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gang_stores', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('gang_id')->unsigned();
            $table->integer('location_place_id')->unsigned();

            $table->integer('level')->unsigned();
            $table->integer('premiumLevel')->unsigned();
            $table->integer('capacity')->unsigned();
            $table->boolean('bought');


            $table->foreign('gang_id')->references('id')->on('gangs')->onDelete('cascade');
            $table->foreign('location_place_id')->references('id')->on('location_places')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('gang_stores');
    }
}

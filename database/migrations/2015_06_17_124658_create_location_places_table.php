<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLocationPlacesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('location_places', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('place_id')->unsigned();
            $table->integer('location_id')->unsigned();
            $table->float('x');
            $table->float('y');

            $table->foreign('place_id')->references('id')->on('places')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('location_id')->references('id')->on('locations')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('location_places');
    }
}

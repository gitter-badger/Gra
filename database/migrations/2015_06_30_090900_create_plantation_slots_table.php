<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlantationSlotsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plantation_slots', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('plantation_id')->unsigned();

            $table->boolean('isEmpty');

            $table->string('species')->nullable();
            $table->integer('watering')->unsigned()->nullable();
            $table->integer('harvestMin')->unsigned()->nullable();
            $table->integer('harvestMax')->unsigned()->nullable();
            $table->integer('quality')->unsigned()->nullable();

            $table->integer('start')->unsigned()->nullable();
            $table->integer('end')->unsigned()->nullable();
            $table->integer('lastWatered')->unsigned()->nullable();

            $table->foreign('plantation_id')->references('id')->on('plantations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('plantation_slots');
    }
}

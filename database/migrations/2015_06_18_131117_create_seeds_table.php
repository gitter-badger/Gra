<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSeedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seeds', function (Blueprint $table)
        {
            $table->increments('id');

            $table->morphs('owner');
            $table->integer('template_id')->unsigned();
            $table->integer('count')->unsigned();



            $table->integer('growth')->unsigned()->nullable();
            $table->integer('watering')->unsigned()->nullable();
            $table->integer('harvestMin')->unsigned()->nullable();
            $table->integer('harvestMax')->unsigned()->nullable();
            $table->integer('quality')->unsigned()->nullable();



            $table->foreign('template_id')->references('id')->on('template_seeds')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('seeds');
    }
}

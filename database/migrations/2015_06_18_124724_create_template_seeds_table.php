<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTemplateSeedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('template_seeds', function (Blueprint $table)
        {
            $table->increments('id');
            $table->string('name')->unique();
            $table->string('image');
            $table->integer('price')->unsigned();
            $table->boolean('premium');
            $table->float('weight');
            $table->json('properties');

            $table->integer('growth')->unsigned();
            $table->integer('watering')->unsigned();
            $table->integer('harvestMin')->unsigned();
            $table->integer('harvestMax')->unsigned();
            $table->float('qualityMin');
            $table->float('qualityMax');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('template_seeds');
    }
}

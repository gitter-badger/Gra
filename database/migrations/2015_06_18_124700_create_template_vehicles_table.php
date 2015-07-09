<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTemplateVehiclesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('template_vehicles', function (Blueprint $table)
        {
            $table->increments('id');
            $table->string('name')->unique();
            $table->string('image');
            $table->integer('price')->unsigned();
            $table->boolean('premium');
            $table->float('weight');
            $table->json('properties');
            
            $table->float('speed');
            $table->float('cost');
            $table->integer('capacity')->unsigned();
            $table->boolean('boostable');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('template_vehicles');
    }
}

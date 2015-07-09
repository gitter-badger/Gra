<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTemplateFoodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('template_foods', function (Blueprint $table)
        {
            $table->increments('id');
            $table->string('name')->unique();
            $table->string('image');
            $table->integer('price')->unsigned();
            $table->boolean('premium');
            $table->float('weight');
            $table->json('properties');
            
            $table->integer('health')->unsigned()->nullable();
            $table->integer('energy')->unsigned()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('template_foods');
    }
}

<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStuffsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stuffs', function (Blueprint $table)
        {
            $table->increments('id');

            $table->morphs('owner');
            $table->integer('template_id')->unsigned();
            $table->integer('count')->unsigned();

            $table->integer('quality')->unsigned()->nullable();




            $table->foreign('template_id')->references('id')->on('template_stuffs');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('stuffs');
    }
}

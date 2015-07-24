<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGangsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gangs', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('world_id')->unsigned();
            $table->string('name');
            $table->integer('level')->unsigned();
            $table->integer('money')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('gangs');
    }
}

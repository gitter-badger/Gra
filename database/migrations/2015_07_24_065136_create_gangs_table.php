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
            $table->string('avatar');
            $table->enum('action', ['attack', 'defend'])->nullable();
            $table->integer('startAttack');
            $table->integer('endAttack');
            $table->integer('attackLevel')->unsigned();
            $table->integer('defenseLevel')->unsigned();
            $table->integer('accomodationLevel')->unsigned();
            $table->integer('money')->unsigned();
            $table->integer('premium')->unsigned();
            $table->integer('respect')->unsigned();
            $table->text('publicText');
            $table->text('privateText');
            $table->timestamps();

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
        Schema::drop('gangs');
    }
}

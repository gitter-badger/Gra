<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlayerNpcsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('player_npcs', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('npc_id')->unsigned();
            $table->integer('player_id')->unsigned();
            $table->integer('location_place_id')->unsigned();


            $table->integer('quest_id')->unsigned()->nullable();



            $table->foreign('npc_id')->references('id')->on('npcs')->onDelete('cascade');
            $table->foreign('player_id')->references('id')->on('players')->onDelete('cascade');
            $table->foreign('location_place_id')->references('id')->on('location_places')->onDelete('cascade');
            $table->foreign('quest_id')->references('id')->on('quests')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('player_npcs');
    }
}

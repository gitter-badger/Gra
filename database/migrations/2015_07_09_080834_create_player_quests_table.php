<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlayerQuestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('player_quests', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('player_id')->unsigned();
            $table->integer('quest_id')->unsigned();
            $table->boolean('active');
            $table->boolean('done');
            $table->integer('player_npc_id')->unsigned()->nullable();
            $table->json('states')->nullable();



            $table->foreign('player_id')->references('id')->on('players');
            $table->foreign('quest_id')->references('id')->on('quests');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('player_quests');
    }
}

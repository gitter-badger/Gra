<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlayerQuestPlayerNpcForeign extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('player_quests', function (Blueprint $table)
        {
            $table->foreign('player_npc_id')->references('id')->on('player_npcs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('player_quests', function (Blueprint $table)
        {
            $table->dropForeign(['player_npc_id']);
        });
    }
}

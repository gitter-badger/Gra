<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlayerBlacklistTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('player_blacklist', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('player_id')->unsigned();
            $table->integer('blocked_id')->unsigned();



            $table->foreign('player_id')->references('id')->on('players')->onDelete('cascade');
            $table->foreign('blocked_id')->references('id')->on('players')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('player_blacklist');
    }
}

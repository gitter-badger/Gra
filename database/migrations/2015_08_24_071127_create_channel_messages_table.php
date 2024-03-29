<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChannelMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('channel_messages', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('channel_id')->unsigned();
            $table->integer('player_id')->unsigned();
            $table->text('message');
            $table->timestamps();


            $table->foreign('channel_id')->references('id')->on('channels')->onDelete('cascade');
            $table->foreign('player_id')->references('id')->on('players')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('channel_messages');
    }
}

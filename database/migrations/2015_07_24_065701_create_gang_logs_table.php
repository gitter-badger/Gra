<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGangLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gang_logs', function (Blueprint $table)
        {
            $table->increments('id');
            $table->string('action');
            $table->integer('gang_id')->unsigned();
            $table->integer('player_id')->unsigned()->nullable();
            $table->text('data');
            $table->timestamps();


            $table->foreign('gang_id')->references('id')->on('gangs')->onDelete('cascade');
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
        Schema::drop('gang_logs');
    }
}

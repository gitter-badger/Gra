<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGangMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gang_members', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('gang_id')->unsigned();
            $table->integer('player_id')->unsigned();
            $table->boolean('joins');
            $table->boolean('muted');
            $table->enum('role', ['newbie', 'member', 'officer', 'boss']);


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
        Schema::drop('gang_members');
    }
}

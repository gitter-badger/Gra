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
            $table->enum('role', ['member', 'oficer', 'boss']);
            $table->integer('permissions')->unsigned();
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

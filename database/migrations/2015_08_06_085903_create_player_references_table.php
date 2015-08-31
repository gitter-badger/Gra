<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlayerReferencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('player_references', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('player_id')->unsigned();
            $table->timestamps();


            $table->foreign('player_id')->references('id')->on('players')->onDelete('cascade');
        });
        DB::statement('ALTER TABLE `player_references` ADD `request_ip` VARBINARY(16)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('ALTER TABLE `player_references` DROP COLUMN `request_ip`');
        Schema::drop('player_references');
    }
}

<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quests', function (Blueprint $table)
        {
            $table->increments('id');
            $table->string('name')->unique();
            $table->boolean('repeatable');
            $table->boolean('breakable');
            $table->boolean('auto');
            $table->boolean('daily');
            $table->json('requires');
            $table->json('rewards');
            $table->json('objectives');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('quests');
    }
}

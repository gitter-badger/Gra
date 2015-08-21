<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWeaponsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('weapons', function (Blueprint $table)
        {
            $table->increments('id');

            $table->morphs('owner');
            $table->integer('template_id')->unsigned();
            $table->integer('count')->unsigned();


            $table->foreign('template_id')->references('id')->on('template_weapons');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('weapons');
    }
}

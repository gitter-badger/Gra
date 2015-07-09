<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCurrentWorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('current_works', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('work_id')->unsigned();
            $table->integer('current_work_group_id')->unsigned();
            $table->boolean('active');
            $table->boolean('done');
            $table->integer('order')->unsigned();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('current_works');
    }
}

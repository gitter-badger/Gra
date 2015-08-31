<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorkStatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('work_states', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('manager_id')->unsigned();
            $table->integer('work_id')->unsigned();
            $table->boolean('active');
            $table->boolean('done');
            $table->integer('counter')->unsigned();
            $table->integer('order')->unsigned();


            $table->foreign('manager_id')->references('id')->on('work_managers')->onDelete('cascade');
            $table->foreign('work_id')->references('id')->on('works')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('work_states');
    }
}

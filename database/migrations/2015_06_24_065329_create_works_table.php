<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('works', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('group_id')->unsigned();
            $table->string('name')->unique();

            $table->integer('duration')->unsigned();

            $table->json('costs');
            $table->json('requires');
            $table->json('rewards');



            $table->foreign('group_id')->references('id')->on('work_groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('works');
    }
}

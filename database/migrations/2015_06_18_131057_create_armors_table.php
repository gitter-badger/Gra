<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArmorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('armors', function (Blueprint $table)
        {
            $table->increments('id');

            $table->morphs('owner');
            $table->integer('template_id')->unsigned();
            $table->integer('count')->unsigned();


            $table->foreign('template_id')->references('id')->on('template_armors');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('armors');
    }
}

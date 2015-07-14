<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvestmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('investments', function (Blueprint $table)
        {
            $table->increments('id');
            $table->string('name')->unique();
            $table->integer('baseIncome')->unsigned();
            $table->integer('incomePerLevel')->unsigned();
            $table->integer('baseCapacity')->unsigned();
            $table->integer('capacityPerLevel')->unsigned();
            $table->integer('upgradeCost')->unsigned();
            $table->integer('maxIncome')->unsigned();
            $table->integer('maxCapacity')->unsigned();
            $table->integer('time')->unsigned();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('investments');
    }
}

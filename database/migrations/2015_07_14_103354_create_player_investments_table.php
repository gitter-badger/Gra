<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlayerInvestmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('player_investments', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('player_id')->unsigned();
            $table->integer('location_place_id')->unsigned();
            $table->integer('investment_id')->unsigned();

            $table->integer('money')->unsigned();

            $table->integer('capacityLevel')->unsigned();
            $table->integer('incomeLevel')->unsigned();

            $table->integer('bought');
            $table->integer('lastUpdate')->unsigned();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('player_investments');
    }
}

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

            $table->integer('worksCount')->unsigned();
            $table->integer('worksNeeded')->unsigned();

            $table->integer('bought');
            $table->integer('lastUpdate')->unsigned();

            $table->integer('managerId')->unsigned()->nullable();
            $table->integer('managerExpires')->unsigned()->nullable();
            $table->integer('managerMoney')->unsigned();


            $table->foreign('player_id')->references('id')->on('players')->onDelete('cascade');
            $table->foreign('location_place_id')->references('id')->on('location_places')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('investment_id')->references('id')->on('investments')->onDelete('cascade');

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

<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlayersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('players', function (Blueprint $table)
        {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->integer('world_id')->unsigned();
            $table->integer('location_id')->unsigned();
            $table->integer('location_place_id')->unsigned()->nullable();

            $table->string('name');

            $table->integer('level')->unsigned();
            $table->integer('experience')->unsigned();
            $table->integer('maxExperience')->unsigned();


            $table->integer('plantatorLevel')->unsigned();
            $table->integer('plantatorExperience')->unsigned();
            $table->integer('plantatorMaxExperience')->unsigned();

            $table->integer('smugglerLevel')->unsigned();
            $table->integer('smugglerExperience')->unsigned();
            $table->integer('smugglerMaxExperience')->unsigned();

            $table->integer('dealerLevel')->unsigned();
            $table->integer('dealerExperience')->unsigned();
            $table->integer('dealerMaxExperience')->unsigned();



            $table->integer('health')->unsigned();
            $table->integer('maxHealth')->unsigned();
            $table->integer('healthUpdate')->unsigned();

            $table->integer('energy')->unsigned();
            $table->integer('maxEnergy')->unsinged();
            $table->integer('energyUpdate')->unsigned();


            $table->integer('wanted')->unsigned();
            $table->integer('wantedUpdate')->unsigned();

            $table->boolean('reload');

            $table->string('jobName')->nullable();
            $table->integer('jobStart')->nullable()->unsigned();
            $table->integer('jobEnd')->nullable()->unsigned();


            $table->integer('strength')->unsigned();
            $table->integer('perception')->unsigned();
            $table->integer('endurance')->unsigned();
            $table->integer('charisma')->unsigned();
            $table->integer('intelligence')->unsigned();
            $table->integer('agility')->unsigned();
            $table->integer('luck')->unsigned();

            $table->integer('luckUpdate')->unsigned();

            $table->integer('nextUpdate')->unsigned()->nullable();

            $table->integer('statisticPoints')->unsigned();
            $table->integer('talentPoints')->unsigned();

            $table->integer('money');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('players');
    }
}

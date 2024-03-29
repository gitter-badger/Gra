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
            $table->integer('gang_id')->unsigned()->nullable();

            $table->string('name');
            $table->string('avatar');
            $table->boolean('fbAvatar');

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
            $table->integer('endHealthUpdate')->unsigned();

            $table->integer('energy')->unsigned();
            $table->integer('maxEnergy')->unsinged();
            $table->integer('energyUpdate')->unsigned();


            $table->integer('wanted')->unsigned();
            $table->integer('wantedUpdate')->unsigned();

            $table->boolean('reload');

            $table->string('jobName')->nullable();
            $table->integer('jobStart')->nullable()->unsigned();
            $table->integer('jobEnd')->nullable()->unsigned();
            $table->boolean('jobBreakable')->nullable();


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

            $table->integer('money')->unsigned();
            $table->integer('respect')->unsigned();

            $table->string('token')->unique();
            $table->integer('todayPoints')->unsigned();
            $table->integer('dailyCombo')->unsigned();
            $table->integer('lastDailyReset')->unsigned();
            $table->timestamps();


            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('world_id')->references('id')->on('worlds')->onDelete('cascade');
            $table->foreign('location_id')->references('id')->on('locations')->onDelete('restrict');
            $table->foreign('location_place_id')->references('id')->on('location_places')->onDelete('set null')->onUpdate('cascade');
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

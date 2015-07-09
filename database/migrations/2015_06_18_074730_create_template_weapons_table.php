<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTemplateWeaponsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('template_weapons', function (Blueprint $table)
        {
            $table->increments('id');

            $table->string('name')->unique();
            $table->string('image');
            $table->integer('price')->unsigned();
            $table->boolean('premium');
            $table->float('weight');
            $table->json('properties');

            $table->integer('damageMin')->unsigned();
            $table->integer('damageMax')->unsigned();
            $table->float('critChance');
            $table->float('speed');
            $table->string('type');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('template_weapons');
    }
}

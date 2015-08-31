<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) 
        {
            $table->increments('id');
            $table->string('email')->unique();
            $table->string('password', 60);
            $table->rememberToken();

            $table->boolean('newsletter');

            $table->string('language');
            $table->integer('premiumPoints')->unsigned();
            $table->integer('premiumStart')->unsigned()->nullable();
            $table->integer('premiumEnd')->unsigned()->nullable();
            $table->boolean('admin')->default(false);
            $table->boolean('verified')->default(false);
            $table->string('token')->unique();
            $table->string('fb_id')->nullable()->unique();

            $table->integer('banStart')->unsigned()->nullable();
            $table->integer('banEnd')->unsigned()->nullable();
            $table->string('banReason')->nullable();


            $table->timestamps();
        });

        DB::statement('ALTER TABLE `users` ADD `registration_ip` VARBINARY(16)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('ALTER TABLE `users` DROP COLUMN `registration_ip`');

        Schema::drop('users');
    }
}

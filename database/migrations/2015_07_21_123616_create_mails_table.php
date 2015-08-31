<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMailsTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mails', function(Blueprint $table)
        {
            $table->increments('id');

            $table->integer('receiver_id')->unsigned();
            $table->integer('sender_id')->unsigned();

            $table->string('title');
            $table->text('content');

            $table->boolean('viewed')->default(false);
            $table->boolean('receiver_deleted')->default(false);
            $table->boolean('sender_deleted')->default(false);
            $table->boolean('notified')->default(false);

            $table->integer('date')->unsigned();


            $table->foreign('receiver_id')->references('id')->on('players')->onDelete('restrict');
            $table->foreign('sender_id')->references('id')->on('players')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('mails');
    }

}

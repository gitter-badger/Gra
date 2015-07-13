<?php

use Illuminate\Database\Seeder;
use HempEmpire\User;
use HempEmpire\Player;


class DeveloperSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([

        	'email' => 'habavx@gmail.com',
        	'password' => bcrypt('123456'),
        	'newsletter' => true,
        	'registration_ip' => '127.0.0.1',
        	'premiumPoints' => 100,
        	'premiumStart' => time(),
        	'premiumEnd' => time() * round(365.75 * 24 * 3600),
        	'admin' => true,
        	'verified' => true,
        	'token' => str_random(64),
    	]);
    }
}
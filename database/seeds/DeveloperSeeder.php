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
        $tokens = [];

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
            'language' => 'pl',
        ]);

        /*
        $j = 1000;
        $l = 50;

        for($i = 0; $i < $j; ++$i)
        {
            $user = User::create([

                'email' => 'habavx' . ($i + 1) . '@gmail.com',
                'password' => bcrypt('123456'),
                'newsletter' => true,
                'registration_ip' => '127.0.0.1',
                'premiumPoints' => 0,
                'premiumStart' => 0,
                'premiumEnd' => 0,
                'admin' => false,
                'verified' => true,
                'token' => str_random(64),
                'language' => 'pl',
            ]);

            $token = null;

            do
            {
                $token = str_random(8);

            } while(array_search($token, $tokens) !== false);

            $tokens[] = $token;



            $player = Player::create([

                'user_id' => $user->id,
                'world_id' => 1,
                'location_id' => 2,
                'name' => 'Player' . ($i + 1),
                'avatar' => ($i % 9) . '.png',
                'strength' => mt_rand(0, 5),
                'perception' => mt_rand(0, 5),
                'endurance' => mt_rand(0, 5),
                'charisma' => mt_rand(0, 5),
                'intelligence' => mt_rand(0, 5),
                'agility' => mt_rand(0, 5),

                'jobStart' => 0,
                'jobEnd' => 0,

                'token' => $token,
            ]);


            $p = (float) ($i + 1) / (float) $j;
            $n = round($p * $l);

            echo '[' . round($p * 100) . '%][';

            for($k = 0; $k < $l; ++$k)
            {
                if($k < $n)
                    echo '=';
                else
                    echo ' ';
            }

            echo '][' . ($i + 1) . '/' . $j . "]\r";
        }

        echo PHP_EOL;
        */
    }
}

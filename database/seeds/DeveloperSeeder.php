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

        for($i = 0; $i < 1000; ++$i)
        {
            if($i % 100 == 0)
            {
                $n = floor($i / 100) * 100;
                echo $n . ' - ' . ($n + 100) . PHP_EOL;
            }

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
            ]);

            $player = Player::create([

                'user_id' => $user->id,
                'world_id' => 1,
                'name' => 'Player' . ($i + 1),
                'avatar' => asset('images/avatars/' . ($i % 9) . '.png'),
                'strength' => mt_rand(0, 5),
                'perception' => mt_rand(0, 5),
                'endurance' => mt_rand(0, 5),
                'charisma' => mt_rand(0, 5),
                'intelligence' => mt_rand(0, 5),
                'agility' => mt_rand(0, 5),
            ]);
        }
    }
}

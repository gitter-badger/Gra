<?php

use Illuminate\Database\Seeder;
use HempEmpire\User;
use HempEmpire\Player;
use HempEmpire\Mail;
use HempEmpire\TemplateArmor;
use HempEmpire\TemplateWeapon;
use HempEmpire\TemplateSeed;
use HempEmpire\TemplateStuff;
use HempEmpire\TemplateVehicle;
use HempEmpire\TemplateFood;

use HempEmpire\Armor;
use HempEmpire\Weapon;
use HempEmpire\Seed;
use HempEmpire\Stuff;
use HempEmpire\Vehicle;
use HempEmpire\Food;


class DeveloperSeeder extends Seeder
{
    function give($player, $type, $count)
    {
        $template = '\\HempEmpire\\Template' . ucfirst($type);
        $class = '\\HempEmpire\\' . ucfirst($type);


        $records = $template::all();

        foreach($records as $record)
        {
            $object = new $class;
            $object->template_id = $record->id;
            $object->count = $count;
            $object->owner()->associate($player);
            $object->save();
        }
    }



    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tokens = [];
        $token = null;
        $j = 50;
        $l = 50;

        $user = User::create([

            'email' => 'habavx@gmail.com',
            'password' => bcrypt('123456'),
            'newsletter' => true,
            'registration_ip' => '127.0.0.1',
            'premiumPoints' => 100,
            'premiumStart' => time(),
            'premiumEnd' => time() + round(365.75 * 24 * 3600),
            'admin' => true,
            'verified' => true,
            'token' => str_random(64),
            'language' => 'pl',
        ]);

        do
        {
            $token = str_random(8);

        } while(array_search($token, $tokens) !== false);

        $tokens[] = $token;

        $me = Player::create([

            'user_id' => $user->id,
            'world_id' => 1,
            'location_id' => 1,
            'name' => 'Admin',
            'avatar' => 'a1.png',
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


        $me->experience = 100000;
        $me->plantatorExperience = 100000;
        $me->smugglerExperience = 100000;
        $me->dealerExperience = 100000;
        $me->save();






        for($i = 0; $i < $j; ++$i)
        {
            $me->newReport('test')->send();
        }

        $this->give($me, 'armor', 1);
        $this->give($me, 'weapon', 1);
        $this->give($me, 'vehicle', 1);
        $this->give($me, 'seed', 1);
        $this->give($me, 'stuff', 1);
        $this->give($me, 'food', 1);


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
                'avatar' => 'a' . ($i % 9) . '.png',
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


            $mail = new Mail;

            $mail->sender_id = $player->id;
            $mail->receiver_id = $me->id;
            $mail->title = 'Tytuł';
            $mail->content = 'Treść';
            $mail->date = time();

            $mail->save();


            $mail = new Mail;

            $mail->sender_id = $me->id;
            $mail->receiver_id = $player->id;
            $mail->title = 'Tytuł';
            $mail->content = 'Treść';
            $mail->date = time();

            $mail->save();



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



    }
}

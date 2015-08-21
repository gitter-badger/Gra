<?php

use Illuminate\Database\Seeder;

class WeaponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $weapons = Config::get('items.weapons');
        $records = [];


        foreach($weapons as $weapon)
        {
        	$records[] = [

        		'name' => $weapon['name'],
                'image' => $weapon['name'] . '.jpg',
        		'damageMin' => $weapon['damage'][0],
        		'damageMax' => $weapon['damage'][1],
        		'critChance' => $weapon['critChance'],
        		'speed' => $weapon['speed'],
        		'type' => $weapon['type'],
        		'price' => $weapon['price'],
                'weight' => $weapon['weight'],
        		'premium' => $weapon['premium'],

                
                'properties' => json_encode(isset($weapon['properties']) ? $weapon['properties'] : []),
        	];
        }

        DB::table('template_weapons')->insert($records);
    }
}

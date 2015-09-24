<?php

use Illuminate\Database\Seeder;

class ArmorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $armors = Config::get('items.armors', []);
        $records = [];


        foreach($armors as $armor)
        {
        	$records[] = [

        		'name' => $armor['name'],
                'image' => $armor['name'] . '.jpg',
                'armor' => $armor['armor'],
        		'speed' => $armor['speed'],
        		'price' => $armor['price'],
                'weight' => $armor['weight'],
        		'premium' => $armor['premium'],
                'properties' => json_encode(isset($armor['properties']) ? $armor['properties'] : []),
        	];
        }

        DB::table('template_armors')->insert($records);
    }
}

<?php

use Illuminate\Database\Seeder;

class PlaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	$records = [];
    	$places = Config::get('places');


    	foreach($places as $place)
    	{
    		$records[] = [

    			'name' => $place['name'],
                'image' => $place['image'],
                'visible' => $place['visible'],
    			'components' => isset($place['components']) ? json_encode($place['components']) : json_encode([]),
    			'properties' => isset($place['properties']) ? json_encode($place['properties']) : json_encode([]),
                'requires' => isset($place['requires']) ? json_encode($place['requires']) : json_encode([]),
    		];
    	}

        DB::table('places')->insert($records);
    }
}

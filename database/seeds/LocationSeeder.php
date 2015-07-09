<?php

use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	$records = [];
    	$locations = Config::get('locations');


    	foreach ($locations as $location)
    	{
    		$records[] = [

    			'name' => $location['name'],
                'image' => $location['image'],
                'groups' => json_encode($location['groups']),
    			'x' => $location['x'],
    			'y' => $location['y'],
    		];
    	}

        DB::table('locations')->insert($records);
    }
}

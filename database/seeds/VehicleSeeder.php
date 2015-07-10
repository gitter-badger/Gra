<?php

use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $vehicles = Config::get('items.vehicles');
        $records = [];


        foreach($vehicles as $vehicle)
        {
        	$records[] = [

        		'name' => $vehicle['name'],
                'image' => $vehicle['name'] . '.jpg',
        		'weight' => $vehicle['weight'],
        		'price' => $vehicle['price'],
        		'premium' => $vehicle['premium'],

        		'speed' => $vehicle['speed'],
        		'cost' => $vehicle['cost'],
        		'capacity' => $vehicle['capacity'],

                
                'properties' => json_encode(isset($vehicle['properties']) ? $vehicle['properties'] : []),
        	];
        }

        DB::table('template_vehicles')->insert($records);
    }
}

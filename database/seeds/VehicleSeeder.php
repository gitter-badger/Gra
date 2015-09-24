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
        $vehicles = Config::get('items.vehicles', []);
        $records = [];


        foreach($vehicles as $vehicle)
        {
        	$records[] = [

        		'name' => $vehicle['name'],
                'image' => $vehicle['name'] . '.jpg',
        		'price' => $vehicle['price'],
                'weight' => $vehicle['weight'],
        		'premium' => $vehicle['premium'],

        		'speed' => $vehicle['speed'],
        		'cost' => $vehicle['cost'],
        		'capacity' => $vehicle['capacity'],
                'type' => $vehicle['type'],

                
                'properties' => json_encode(isset($vehicle['properties']) ? $vehicle['properties'] : []),
        	];
        }

        DB::table('template_vehicles')->insert($records);
    }
}

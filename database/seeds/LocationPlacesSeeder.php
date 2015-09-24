<?php

use Illuminate\Database\Seeder;

use HempEmpire\Location;
use HempEmpire\Place;

class LocationPlacesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $records = [];
        $locations = Config::get('locations', []);


        foreach($locations as $locationData)
        {
        	$location = Location::whereName($locationData['name'])->firstOrFail();


        	if(isset($locationData['places']))
        	{
        		$places = $locationData['places'];


        		foreach($places as $placeName)
        		{
        			$place = Place::whereName($placeName)->firstOrFail();

        			$records[] = [

        				'location_id' => $location->id,
        				'place_id' => $place->id,
        			];
        		}
        	}
        }

        DB::table('location_places')->insert($records);
    }
}

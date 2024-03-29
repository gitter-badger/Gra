<?php

use Illuminate\Database\Seeder;

class StuffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $species = Config::get('items.species', []);
        $records = [];


        if(count($species) > 0)
        {
            foreach($species as $specie)
            {
                $records[] = [

                    'name' => $specie['name'] . '-stuff',
                    'image' => 'stuff.jpg',
                    'price' => $specie['price'][1],
                    'weight' => $specie['weight'][1],
                    'premium' => $specie['premium'][1],

                    'quality' => ($specie['quality'][0] + $specie['quality'][1]) / 2,

                    
                    'properties' => json_encode(isset($specie['properties']) ? $specie['properties'] : []),
                ];
            } 
        }

        $stuffs = Config::get('items.stuffs', []);



        if(count($stuffs) > 0)
        {
            foreach($stuffs as $stuff)
            {
                $records[] = [

                    'name' => $stuff['name'],
                    'image' => $stuff['image'],
                    'price' => $stuff['price'],
                    'weight' => $stuff['weight'],
                    'premium' => $stuff['premium'],

                    'quality' => $stuff['quality'],

                    
                    'properties' => json_encode(isset($stuff['properties']) ? $stuff['properties'] : []),
                ];
            } 
        }


        DB::table('template_stuffs')->insert($records);
    }
}

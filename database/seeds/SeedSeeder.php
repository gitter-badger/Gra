<?php

use Illuminate\Database\Seeder;

class SeedSeeder extends Seeder
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

                    'name' => $specie['name'] . '-seed',
                    'image' => 'seed.jpg',
                    'price' => $specie['price'][0],
                    'weight' => $specie['weight'][0],
                    'premium' => $specie['premium'][0],

                    'growth' => $specie['growth'],
                    'watering' => $specie['watering'],
                    'harvestMin' => $specie['harvest'][0],
                    'harvestMax' => $specie['harvest'][1],
                    'quality' => $specie['quality'],

                    'properties' => json_encode(isset($specie['properties']) ? $specie['properties'] : []),
                ];
            }
        }

        $seeds = Config::get('items.seeds', []);



        if(count($seeds) > 0)
        {
            foreach($seeds as $seed)
            {
                $records[] = [

                    'name' => $seed['name'] ,
                    'image' => $seed['image'],
                    'price' => $seed['price'],
                    'weight' => $seed['weight'],
                    'premium' => $seed['premium'],

                    'growth' => $seed['growth'],
                    'watering' => $seed['watering'],
                    'harvestMin' => $seed['harvest'][0],
                    'harvestMax' => $seed['harvest'][1],
                    'quality' => $seed['quality'],

                    
                    'properties' => json_encode(isset($seed['properties']) ? $seed['properties'] : []),
                ];
            }
        }


        DB::table('template_seeds')->insert($records);
    }
}

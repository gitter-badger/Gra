<?php

use Illuminate\Database\Seeder;

class FoodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $foods = Config::get('items.foods', []);
        $records = [];


        foreach($foods as $food)
        {
        	$records[] = [

        		'name' => $food['name'],
                'image' => $food['name'] . '.jpg',
        		'price' => $food['price'],
                'weight' => $food['weight'],
        		'premium' => $food['premium'],

        		'health' => $food['health'],
        		'energy' => $food['energy'],

                'properties' => json_encode(isset($food['properties']) ? $food['properties'] : []),
        	];
        }

        DB::table('template_foods')->insert($records);
    }
}

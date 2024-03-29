<?php

use Illuminate\Database\Seeder;
//use Config;
//use DB;

class NpcSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	$records = [];

        foreach(Config::get('npcs', []) as $name => $npc)
        {
        	$records[] = [

        		'name' => $name,
        		'image' => $npc['image'],
        		'quests' => json_encode($npc['quests']),
        	];
        }

        DB::table('npcs')->insert($records);

    }
}

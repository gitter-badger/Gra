<?php

use Illuminate\Database\Seeder;
use HempEmpire\QuestGroup;
use HempEmpire\Quest;

class QuestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $records = [];

        $groups = Config::get('quests');


        foreach($groups as $groupName => $quests)
        {
        	$group = QuestGroup::create([

        		'name' => $groupName,
    		]);


    		foreach($quests as $questName => $questData)
    		{
    			DB::table('quests')->insert([

	    			'name' => $questName,
	    			'group_id' => $group->id,

	    			'rewards' => json_encode(isset($questData['rewards']) ? $questData['rewards'] : []),
	    			'requires' => json_encode(isset($questData['requires']) ? $questData['requires'] : []),
				]);
    		}
        }

    }
}

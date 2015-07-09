<?php

use Illuminate\Database\Seeder;
use HempEmpire\WorkGroup;
use HempEmpire\Work;

class WorkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $records = [];

        $groups = Config::get('works');


        foreach($groups as $groupName => $works)
        {
        	$group = WorkGroup::create([

        		'name' => $groupName,
    		]);


    		foreach($works as $workName => $workData)
    		{
    			DB::table('works')->insert([

	    			'name' => $workName,
	    			'group_id' => $group->id,
	    			'duration' => $workData['duration'],

	    			'costs' => json_encode(isset($workData['costs']) ? $workData['costs'] : []),
	    			'rewards' => json_encode(isset($workData['rewards']) ? $workData['rewards'] : []),
	    			'requires' => json_encode(isset($workData['requires']) ? $workData['requires'] : []),
				]);
    		}
        }

    }
}

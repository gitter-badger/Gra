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

        $quests = Config::get('quests');


        foreach($quests as $questName => $questData)
        {
            $records[] = [

                'name' => $questName,
                'repeatable' => $questData['repeatable'],
                'breakable' => $questData['breakable'],
                'auto' => $questData['auto'],
                'daily' => $questData['daily'],
                'rewards' => json_encode(isset($questData['rewards']) ? $questData['rewards'] : []),
                'requires' => json_encode(isset($questData['requires']) ? $questData['requires'] : []),
                'objectives' => json_encode(isset($questData['objectives']) ? $questData['objectives'] : []),
            ];

        }

        DB::table('quests')->insert($records);
    }
}

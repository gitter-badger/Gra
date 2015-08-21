<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;



use HempEmpire\Player;


class Gamble extends Job implements SelfHandling, ShouldQueue
{
    use InteractsWithQueue, SerializesModels;
    private $player;
    private $bet;
    private $exchange;


    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, $bet, $exchange)
    {
        $this->player = $player;
        $this->bet = $bet;
        $this->exchange = $exchange;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

        foreach($this->player->quests as $quest)
            $quest->init();

        echo __METHOD__ . PHP_EOL;
        if($this->player->jobName == 'gambling')
        {
            $roll = mt_rand(0, 100);

            if($this->player->roll(0, 50) > $roll)
            {
                $reward = round($this->bet * $this->exchange);

                $this->player->money += $reward;
                $this->player->save();


                $this->player->newReport('gamble-win')
                    ->param('money', $reward)->send();
            }
            else
            {
                $this->player->newReport('gamble-lose')
                    ->param('money', $this->bet)->send();
            }
        }




        foreach($this->player->quests as $quest)
            $quest->finit();
    }
}

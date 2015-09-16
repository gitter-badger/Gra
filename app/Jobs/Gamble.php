<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\PlayerJob;
use HempEmpire\Player;


class Gamble extends PlayerJob
{
    private $bet;
    private $exchange;


    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, $bet, $exchange)
    {
        parent::__construct($player);
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
    }
}

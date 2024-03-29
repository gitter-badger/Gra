<?php

namespace HempEmpire\Events;

use HempEmpire\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

use HempEmpire\Player;
use HempEmpire\WorkState;

class WorkStart extends Event
{
    use SerializesModels;
    public $player;
    public $work;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Player $player, WorkState $work)
    {
        $this->player = $player;
        $this->work = $work;
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return [];
    }
}

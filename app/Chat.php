<?php

namespace HempEmpire;

use Config;
use Debugbar;
use HempEmpire\World;
use HempEmpire\Player;
use HempEmpire\Channel;
use HempEmpire\ChannelMessage as Message;




trait Chat
{
    protected function getChannel()
    {
        if(World::hasSelected())
        {
            return World::getSelected()->channel()->firstOrCreate([]);
        }
        else
        {
            return null;
        }
    }

    protected function getPlayer()
    {
    	return Player::getActive();
    }

    protected function getMinLength()
    {
        return Config::get('chat.minLength', 1);
    }

    protected function getMaxLength()
    {
        return Config::get('chat.maxLength', 512);
    }

    protected function getHistory()
    {
        return Config::get('chat.history', 3600);
    }

    protected function getInterval()
    {
        return Config::get('chat.interval', 2);
    }

    protected function getJoin()
    {
        return Config::get('chat.join', 60);
    }

    protected function getCooldown()
    {
        return Config::get('chat.cooldown', 0);
    }












    public function view($view = 'chat')
    {
        return view($view)
            ->with('minLength', $this->getMinLength())
            ->with('maxLength', $this->getMaxLength())
            ->with('history', $this->getHistory())
            ->with('interval', $this->getInterval())
            ->with('cooldown', $this->getCooldown())
            ->with('join', $this->getJoin());
    }

    public function extend($view)
    {
        return $view
            ->with('minLength', $this->getMinLength())
            ->with('maxLength', $this->getMaxLength())
            ->with('history', $this->getHistory())
            ->with('interval', $this->getInterval())
            ->with('cooldown', $this->getCooldown())
            ->with('join', $this->getJoin());
    }

    public function receive($time = null)
    {
        Debugbar::disable();


        if(is_null($time))

            $time = time() - $this->getHistory();
        else

            $time = max($time, time() - $this->getHistory());


        return $this->getChannel()->messages()->where('created_at', '>=', date('Y-m-d H:i:s', $time))
            ->orderBy('created_at', 'asc')->get()->toJson();
    }


    public function send($message)
    {
        Debugbar::disable();
        $channel = $this->getChannel();
        $player = $this->getPlayer();


        if(strlen($message) < $this->getMinLength())
        {
            return response()->json([

                'status' => 'error',
                'reason' => 'tooShort',
                'args' => ['min' => $this->getMinLength()],

            ]);
        }
        elseif(strlen($message) > $this->getMaxLength())
        {
            return response()->json([

                'status' => 'error',
                'reason' => 'tooLong',
                'args' => ['max' => $this->getMaxLength()]
            ]);
        }
        else
        {
            $msg = new Message;


            $msg->player()->associate($player);
            $msg->channel()->associate($channel);
            $msg->message = $message;


            if($msg->save())
            {
                return response()->json(['status' => 'success']);
            }
            else
            {
                return response()->json(['status' => 'error', 'reason' => 'unknown']);
            }
        }
    }
}
<?php

namespace HempEmpire\Http\Controllers;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;
use Debugbar;
use Config;



use HempEmpire\World;
use HempEmpire\Player;
use HempEmpire\Channel;
use HempEmpire\ChannelMessage as Message;


class ChatController extends Controller
{
    protected $channel;
    protected $player;
    protected $view = 'chat';




    public function __construct()
    {
        $this->player = Player::getActive();
        $this->channel = $this->getChannel();
    }





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

    protected function canPost()
    {
        return true;
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












    public function getIndex()
    {
        return view($this->view)
            ->with('minLength', $this->getMinLength())
            ->with('maxLength', $this->getMaxLength())
            ->with('history', $this->getHistory())
            ->with('interval', $this->getInterval())
            ->with('cooldown', $this->getCooldown())
            ->with('join', $this->getJoin());
    }

    public function getMessage(Request $request)
    {
        Debugbar::disable();

        $time = time() - $this->getHistory();

        if($request->has('time'))
            $time = $request->input('time');

        //dd($time, date('Y-m-d H:i:s', $time));

        return $this->channel->messages()->where('created_at', '>=', date('Y-m-d H:i:s', $time))
            ->orderBy('created_at', 'asc')->get()->toJson();
    }


    public function postMessage(Request $request)
    {
        Debugbar::disable();


        $message = $request->input('message');

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
        elseif(!$this->canPost())
        {
            return response()->json(['status' => 'error']);
        }
        else
        {
            $msg = new Message;


            $msg->player()->associate($this->player);
            $msg->channel()->associate($this->channel);
            $msg->message = $message;


            if($msg->save())
            {
                return response()->json(['status' => 'success']);
            }
            else
            {
                return response()->json(['status' => 'error']);
            }
        }
    }

}

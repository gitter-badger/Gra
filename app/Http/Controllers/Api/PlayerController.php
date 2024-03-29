<?php

namespace HempEmpire\Http\Controllers\Api;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\Player;
use Debugbar;
use Request;
use DB;

class PlayerController extends Controller
{
	private $player;



	public function __construct()
	{
		Debugbar::disable();
		$this->player = Player::getActive();
	}


	public function getIndex()
	{
		$json = $this->player->toJson();
		$this->player->reload = false;
		$this->player->save();

		return $json;
	}

	public function getNotifications()
	{
		$notifications = null;

		DB::transaction(function() use(&$notifications)
		{
			$notifications = $this->player->reports()->where('notified', '=', false)->orderBy('date', 'desc')->orderBy('id', 'asc')->get();
			$this->player->reports()->update(['notified' => true]);
		});

		return isset($notifications) ? $notifications->toJson() : json_encode([]);
	}

	public function getMessages()
	{
		$messages = null;

		DB::transaction(function() use(&$messages)
		{
			$messages = $this->player->inbox()->where('notified', '=', false)->orderBy('date', 'desc')->orderBy('id', 'asc')->get();
			$this->player->inbox()->update(['notified' => true]);
		});

		return isset($messages) ? $messages->toJson() : json_encode([]);
	}


	public function getTutorial()
	{
		$name = Request::input('name');
		$tutorial = $this->player->user->tutorials()->whereName($name)->first();

		if(is_null($tutorial))
		{
			$tutorial = new \HempEmpire\UserTutorial;
			$tutorial->user_id = $this->player->user->id;
			$tutorial->name = $name;
			$tutorial->stage = -1;
			$tutorial->active = true;
			$tutorial->save();
		}

		return $tutorial->toJson();
	}


	public function postTutorial()
	{
		if(Request::has('stage'))
		{
			$this->player->user->tutorials()->whereName(Request::input('name'))->update(['stage' => Request::get('stage')]);
		}
		elseif(Request::has('active'))
		{
			$this->player->user->tutorials()->whereName(Request::input('name'))->update(['stage' => 0, 'active' => Request::get('active')]);
		}
	}

}

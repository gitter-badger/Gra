<?php

namespace HempEmpire\Http\Controllers\Api;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\Player;
use Debugbar;
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
		return $this->player->toJson();
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

}

<?php

namespace HempEmpire\Http\Controllers\Api;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\Player;
use Debugbar;
use Request;
use DB;

class LocationController extends Controller
{
	private $player;



	public function __construct()
	{
		Debugbar::disable();
		$this->player = Player::getActive();
	}



	public function getIndex()
	{
		return $this->player->location->toJson();
	}




}

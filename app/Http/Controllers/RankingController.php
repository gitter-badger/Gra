<?php

namespace HempEmpire\Http\Controllers;
use DB;
use PDO;
use Request;
use Illuminate\Pagination\LengthAwarePaginator;

use HempEmpire\World;
use HempEmpire\Player;


class RankingController extends Controller
{
	private $world;
	private $player;
	private $view;

	public function __construct()
	{
		$this->world = World::getSelected();
		$this->player = Player::getActive();
	}


	protected function selectPlayer($property, $order = 'DESC')
	{
		if(empty($this->view))
		{
			$pdo = DB::getPdo();
			$pdo->exec('SET @index := 0');

			$this->view = $pdo->query('SELECT `id`, `name`, `' . $property . '`, @index := @index + 1 as `index` FROM `players` WHERE `world_id` = ' .
				$this->world->id . ' ORDER BY `' . $property . '` ' . $order)->fetchAll(PDO::FETCH_ASSOC);
		}
	}

	protected function selectGang($property, $order = 'DESC')
	{
		if(empty($this->view))
		{
			$pdo = DB::getPdo();
			$pdo->exec('SET @index := 0');

			$this->view = $pdo->query('SELECT `id`, `name`, `' . $property . '`, @index := @index + 1 as `index` FROM `gangs` WHERE `world_id` = ' .
				$this->world->id . ' ORDER BY `' . $property . '` ' . $order)->fetchAll(PDO::FETCH_ASSOC);
		}
	}

	protected function find()
	{
		foreach($this->view as $record)
		{
			if($record['id'] == $this->player->id)
				return $record['index'];
		}
		return 0;
	}

	protected function paginate($perPage = 25)
	{
		$page = Request::input('page', floor($this->find() / $perPage) + 1);

		$count = count($this->view);
		$slice = array_slice($this->view, ($page - 1) * $perPage, $perPage);


		return (new LengthAwarePaginator($slice, $count, $perPage, $page))
			->setPath(Request::url());
	}



	public function getIndex()
	{
		return redirect(url('/ranking/level'));
	}


	public function getLevel()
	{
		$this->selectPlayer('level');

		return view('ranking.level')
			->with('players', $this->paginate());
	}

	public function getPlantator()
	{
		$this->selectPlayer('plantatorLevel');

		return view('ranking.plantator')
			->with('players', $this->paginate());
	}

	public function getSmuggler()
	{
		$this->selectPlayer('smugglerLevel');

		return view('ranking.smuggler')
			->with('players', $this->paginate());
	}

	public function getDealer()
	{
		$this->selectPlayer('dealerLevel');

		return view('ranking.dealer')
			->with('players', $this->paginate());
	}

	public function getRespect()
	{
		$this->selectPlayer('respect');

		return view('ranking.respect')
			->with('players', $this->paginate());
	}

	public function getGangLevel()
	{
		$this->selectGang('level');

		return view('ranking.gang-level')
			->with('gangs', $this->paginate());
	}

	public function getGangRespect()
	{
		$this->selectGang('respect');

		return view('ranking.gang-respect')
			->with('gangs', $this->paginate());
	}

	public function getGangMoney()
	{
		$this->selectGang('money');

		return view('ranking.gang-money')
			->with('gangs', $this->paginate());
	}





}
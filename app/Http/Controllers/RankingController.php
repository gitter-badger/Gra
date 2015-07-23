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


	protected function select($property, $order = 'DESC')
	{
		if(empty($this->view))
		{
			$pdo = DB::getPdo();
			$pdo->exec('SET @index := 0');

			$this->view = $pdo->query('SELECT `id`, `name`, `' . $property . '`, @index := @index + 1 as `index` FROM `players` WHERE `world_id` = ' .
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
		$this->select('level');

		return view('ranking.level')
			->with('players', $this->paginate());
	}

	public function getPlantator()
	{
		$this->select('plantatorLevel');

		return view('ranking.plantator')
			->with('players', $this->paginate());
	}

	public function getSmuggler()
	{
		$this->select('smugglerLevel');

		return view('ranking.smuggler')
			->with('players', $this->paginate());
	}

	public function getDealer()
	{
		$this->select('dealerLevel');

		return view('ranking.dealer')
			->with('players', $this->paginate());
	}





}
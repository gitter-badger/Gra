<?php

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;


class PlayerTest extends TestCase
{
	use DatabaseMigrations;



	protected function getStatistics()
	{
		$stats = ['strength' => 0, 'perception' => 0, 'endurance' => 0, 'charisma' => 0, 'intelligence' => 0, 'agility' => 0];
		$names = array_keys($stats);
		$count = count($stats);

		for($points = Config::get('player.start.stats'); $points > 0; $points--)
		{
			$random = mt_rand(0, $count - 1);
			$key = $names[$random];

			$stats[$key]++;
		}

		return $stats;
	}


	public function testCreate()
	{
		$user = factory(HempEmpire\User::class)->create();
		$world = factory(HempEmpire\World::class)->create();
		$location = factory(HempEmpire\Location::class)->create();

		Config::set('player.start.location', $location->name);


		$this->actingAs($user)
			->withSession(['world' => $world->id]);

		$data = $this->getStatistics();
		$data['name'] = 'test';

		$this->visit(route('player.create'));

		foreach($data as $name => $value)
			$this->type($value, $name);

		$this->press(trans('player.create'))
			->seeInDatabase('players', $data);
	}

	public function testDuplicate()
	{
		$users = factory(HempEmpire\User::class, 2)->create();
		$world = factory(HempEmpire\World::class)->create();
		$location = factory(HempEmpire\Location::class)->create();

		Config::set('player.start.location', $location->name);



		$data = $this->getStatistics();
		$data['name'] = 'test';





		$this->actingAs($users[0])
			->withSession(['world' => $world->id]);

		$this->visit(route('player.create'));

		foreach($data as $name => $value)
			$this->type($value, $name);

		$this->press(trans('player.create'));





		$this->actingAs($users[1])
			->withSession(['world' => $world->id]);

		$this->visit(route('player.create'));

		foreach($data as $name => $value)
			$this->type($value, $name);

		$this->press(trans('player.create'));

		$this->see(trans('validation.unique'));

	}

	public function testInvalidStats()
	{
		$user = factory('HempEmpire\User')->create();
		$world = factory('HempEmpire\World')->create();

		$this->actingAs($user)
			->withSession(['world' => $world->id]);


		$this->visit(route('player.create'))
			->type('test', 'name')
			->type(0, 'strength')
			->type(0, 'perception')
			->type(0, 'endurance')
			->type(0, 'charisma')
			->type(0, 'intelligence')
			->type(0, 'agility')
			->press(trans('player.create'))
			->see(trans('error.wrongStatistics'));
	}
}
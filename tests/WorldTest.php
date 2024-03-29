<?php

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class WorldTest extends TestCase
{
	use DatabaseMigrations;



	public function testView()
	{
		$user = factory('HempEmpire\User')->create();
		$worlds = factory('HempEmpire\World', 4)->create();


		$this->actingAs($user)
			->visit(route('world.list'));

		foreach($worlds as $world)
		{
			$this->see(trans('world.' . $world->id));
		}
	}


	public function testSelect()
	{
		$user = factory('HempEmpire\User')->create();
		$world = factory('HempEmpire\World')->create();


		$this->actingAs($user)
			->visit(route('world.select', ['world' => $world->id]))
			->seePageIs(route('player.create'));

		$this->assertTrue(HempEmpire\World::hasSelected());
	}

}
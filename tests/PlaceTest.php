<?php

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;


class PlaceTest extends TestCase
{
	use DatabaseMigrations;

	private $world;
	private $user;
	private $player;
	private $location;
	private $place;

	private function init()
	{

		$this->world = factory(HempEmpire\World::class)->create();
		$this->user = factory(HempEmpire\User::class)->create();
		$this->player = factory(HempEmpire\Player::class)->make();

		$this->location = factory(HempEmpire\Location::class)->create();
		$this->place = factory(HempEmpire\Place::class)->create();

		$this->location->places()->attach($this->place);
		$this->world->select();

		$this->player->world()->associate($this->world);
		$this->player->user()->associate($this->user);
		$this->player->location()->associate($this->location);
		$this->player->save();
	}


	public function testView()
	{
		$this->init();

		$this->actingAs($this->user)
			->visit(route('game'))
			->see(trans('place.' . $this->place->name . '.name'));
	}
}
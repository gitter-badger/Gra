<?php

namespace HempEmpire\Components;
use Illuminate\Foundation\Bus\DispatchesJobs;
use HempEmpire\DispatchesMessages;
use HempEmpire\Contracts\Component as ComponentContract;
use HempEmpire\Player;
use HempEmpire\LocationPlace;
use Message;


abstract class Component implements ComponentContract
{
	use DispatchesJobs;
	use DispatchesMessages;

	protected $place;
	protected $player;
	protected $index = 0;


	public final function loaded(LocationPlace $place)
	{
		$this->player = Player::getActive();
		$this->place = $place;
		$this->init();
	}

	public function init()
	{

	}

	public function view()
	{

	}

	public function action($action, $request)
	{

	}

	public function before()
	{

	}

	public function after()
	{

	}

	public function index()
	{
		return $this->index;
	}

	public final function handle($action, $request)
	{
		$method = 'action' . ucfirst($action);

		$this->action($action, $request);
		
		if(method_exists($this, $method))
		{
			call_user_func([$this, $method], $request);
		}
	}


	protected function prevent()
	{
		$this->place->prevent();
	}

	protected function getName()
	{
		if(property_exists($this, 'name'))
		{
			return $this->name;
		}
		else
		{
			return lcfirst(class_basename(get_called_class()));
		}
	}

	protected function getProperty($name, $default = null)
	{
		return $this->place->getProperty($this->getName() . '.' . $name, $default);
	}

	protected function getPlaceId()
	{
		return $this->place->id;
	}

	protected function getPlace()
	{
		return $this->place;
	}

	protected function getPlaceName()
	{
		return $this->place->name;
	}
}

<?php

namespace HempEmpire\Objectives;
use HempEmpire\Contracts\Objective as ObjectiveContract;
use Illuminate\Queue\SerializesModels;
use HempEmpire\Player;
use HempEmpire\Debug;
use BootForm;
use Event;



abstract class Objective implements ObjectiveContract
{
	//use SerializesModels;
	private $_changed = false;
	protected $_player;



	protected function renderProgress($label, $state, $max)
	{
		$progress = entity('progress')
			->min(0)
			->now(min($state, $max))
			->max($max);

		return BootForm::staticInput('<strong>' . $label . '</strong>')->value($progress);
	}

	protected function renderCheckbox($label, $state)
	{
		$icon = entity('icon')
			->icon($state ? 'ok' : 'remove')
			->addClass($state ? 'success' : 'danger');

		return BootForm::staticInput('<strong>' . $label . '</strong>')->value($icon);
	}



	public function changed()
	{
		return $this->_changed;
	}


	protected function change()
	{
		$this->_changed = true;
	}

	protected function listen($event, $callback)
	{
		if(is_string($callback))
			$callback = [$this, $callback];


		$filter = function($event) use($callback)
		{
			$this->log('Event: ' . class_basename(get_class($event)));

			if(!isset($event) || !isset($event->player) || $this->accepts($event->player))
			{
				$this->log('passed');
				call_user_func($callback, $event);
			}
			else
			{
				$this->log('skipped');
			}
		};


		Event::listen($event, $filter);
	}

	public function init()
	{

	}

	public function setup(Player $player)
	{
		$this->_player = $player;
		$this->init();
	}


	public function __sleep()
	{
		$properties = get_object_vars($this);
		$sleep = [];

		foreach($properties as $name => $value)
		{
			if(!starts_with($name, '_'))
			{
				$sleep[] = $name;
			}
		}

		return $sleep;
	}

	private function accepts(Player $player)
	{
		return !is_null($this->_player) && $this->_player->id == $player->id;
	}

	protected function player()
	{
		if(isset($this->_player))
		{
			$this->log('Returning specific player (' . $this->_player->id . ')');
			return $this->_player;
		}
		else
		{
			$this->_player = Player::getActive();		
			$this->log('Returning default player (' . $this->_player->id . ')');
			return $this->_player;
		}
	}

	protected function log($string)
	{
		Debug::log($string);
	}

}
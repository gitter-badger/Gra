<?php

namespace HempEmpire\Entities\Progress;
use HempEmpire\Entities\Entity;


class Label extends Entity
{
	protected $max, $now;
	protected $visible;

	public function __construct()
	{
		$this->addClass('progress-label')
			->setVisible(true)
			->setMax(100)
			->setNow(0);
	}

	public function setNow($value)
	{
		$this->now = $value;
		return $this;
	}

	public function getNow()
	{
		return $this->now;
	}

	public function setMax($value)
	{
		$this->max = $value;
		return $this;
	}

	public function getMax()
	{
		return $this->max;
	}


	protected function updateContent()
	{
		$this->content = [$this->now . ' / ' . $this->max];
	}

	public function setVisible($value)
	{
		$this->visible = $value;
		return $this;
	}

	public function getVisible()
	{
		return $this->visible;
	}

	public function render()
	{
		if($this->visible)
		{
			$this->updateContent();
			return parent::render();
		}
		else
		{
			return '';
		}
	}
}

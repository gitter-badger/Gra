<?php

namespace HempEmpire\Entities\Progress;
use HempEmpire\Entities\Entity;
use Formatter;


class Bar extends Entity
{
	protected $min, $max, $now, $stop;
	protected $style;
	protected $reversed;
	protected $reload;

	public function __construct()
	{
		$this->addClass('progress-bar')
			->setMin(0)
			->setMax(100)
			->setNow(0)
			->setStop(null);
	}

	public function setNow($value)
	{
		$this->now = $value;

		$this->setAttribute('data-now', $value);

		return $this;
	}

	public function getNow()
	{
		return $this->getAttribute('data-now');
	}

	public function setCa($value)
	{
		$this->setAttribute('data-ca', $value);

		return $this;
	}

	public function getCa()
	{
		return $this->getAttribute('data-ca');
	}

	public function setCb($value)
	{
		$this->setAttribute('data-cb', $value);

		return $this;
	}

	public function getCb()
	{
		return $this->getAttribute('data-cb');
	}

	public function setMax($value)
	{
		$this->max = $value;

		$this->setAttribute('data-max', $value);

		return $this;
	}

	public function getMax()
	{
		return $this->getAttribute('data-max');
	}

	public function setMin($value)
	{
		$this->min = $value;

		$this->setAttribute('data-min', $value);

		return $this;
	}

	public function getMin()
	{
		return $this->getAttribute('data-min');
	}

	public function setStop($value)
	{
		$this->stop = $value;

		if(is_null($value))
		{
			$this->removeAttribute('data-stop');
		}
		else
		{
			$this->setAttribute('data-stop', $value);
		}

		return $this;
	}

	public function getStop()
	{
		return $this->getAttribute('data-stop');
	}

	protected function updateWidth()
	{
		$percent = null;

		if(is_null($this->stop))
		{
			$percent = clamp(($this->now - $this->min) / ($this->max - $this->min), 0, 1);
		}
		else
		{
			$percent = clamp((min($this->now, $this->stop) - $this->min) / ($this->max - $this->min), 0, 1);
		}

		if($this->reversed)
			$percent = 1 - $percent;

		$this->setAttribute('style', 'width: ' . Formatter::percent($percent, 2));
	}

	public function setStyle($name)
	{
		if(!is_null($this->style))
			$this->removeClass('progress-bar-' . $this->style);
		
		if(!is_null($name))
			$this->addClass('progress-bar-' . $name);

		$this->style = $name;
		return $this;
	}

	public function getStyle()
	{
		return $this->style;
	}

	public function setReversed($value)
	{
		$this->reversed = boolval($value);
		$this->setAttribute('data-reversed', $this->reversed);
		return $this;
	}

	public function getReversed()
	{
		return $this->reversed;
	}

	public function setReload($value)
	{
		$this->reload = $value;
		$this->setAttribute('data-reload', $this->reload);
		return $this;
	}

	public function getReload()
	{
		return $this->reload;
	}

	public function render()
	{
		$this->updateWidth();
		return parent::render();
	}


}

<?php

namespace HempEmpire\Entities;
use HempEmpire\Entities\Progress\Bar;
use HempEmpire\Entities\Progress\Label;


class Progress extends Entity
{
	protected $bar;
	protected $label;



	public function __construct()
	{
		$this->addClass('progress');

		$this->bar = new Bar;
		$this->label = new Label;

		$this->append($this->bar)
			->append($this->label);
	}


	public function getLabel()
	{
		return $this->label;
	}

	public function getBar()
	{
		return $this->bar;
	}


	public function setNow($value)
	{
		$this->bar->setNow($value);
		$this->label->setNow($value);

		return $this;
	}

	public function getNow()
	{
		return $this->bar->getNow();
	}


	public function setCa($value)
	{
		$this->bar->setCa($value);
		$this->label->setCa($value);

		return $this;
	}

	public function getCa()
	{
		return $this->bar->getCa();
	}


	public function setCb($value)
	{
		$this->bar->setCb($value);
		$this->label->setCb($value);

		return $this;
	}

	public function getCb()
	{
		return $this->bar->getCb();
	}


	public function setMax($value)
	{
		$this->bar->setMax($value);
		$this->label->setMax($value);

		return $this;
	}

	public function getMax()
	{
		return $this->bar->getMax();
	}


	public function setMin($value)
	{
		$this->bar->setMin($value);

		return $this;
	}

	public function getMin()
	{
		return $this->bar->getMin();
	}

	public function setStyle($name)
	{
		$this->bar->setStyle($name);
		return $this;
	}

	public function getStyle()
	{
		return $this->bar->getStyle();
	}

	public function setReversed($value)
	{
		$this->bar->setReversed($value);
		return $this;
	}

	public function getReversed()
	{
		return $this->bar->getReversed();
	}

	public function setLabelVisible($value)
	{
		$this->label->setVisible($value);
		return $this;
	}

	public function getLabelVisible()
	{
		return $this->label->getVisible();
	}
}

<?php
namespace HempEmpire\Entities;

class Icon extends Entity
{
	private static $CSS_CLASS = 'glyphicon';
	private static $CSS_PREFIX = 'glyphicon-';

	protected $tag = 'span';
	protected $icon = null;

	public function __construct()
	{
		$this->addClass(static::$CSS_CLASS);
	}


	public function setIcon($icon)
	{
		if(!is_null($this->icon))
		{
			$this->removeClass(static::$CSS_PREFIX . $this->icon);
		}

		$this->icon = $icon;

		if(!is_null($this->icon))
		{
			$this->addClass(static::$CSS_PREFIX . $this->icon);
		}

		return $this;
	}

	public function getIcon()
	{
		return $this->icon;
	}

	public function render()
	{
		if(!is_null($this->icon))
		{
			return parent::render();
		}
		else
		{
			return '';
		}
	}
}
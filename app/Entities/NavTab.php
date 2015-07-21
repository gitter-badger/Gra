<?php

namespace HempEmpire\Entities;
use Request;


class NavTab extends Entity
{
	protected $tag = 'li';
	private $url = null;
	private $icon = null;
	private $link = null;

	public function __construct()
	{
		$this->addClass('btn btn-default navbar-btn');

		$this->icon = new Icon;
		$this->content = [$this->icon];
	}


	public function setUrl($value)
	{
		$this->url = $value;


		if(isCurrentUrl($value))
		{
			$this->addClass('active');
		}

		$this->setAttribute('href', $value);


		return $this;
	}

	public function getUrl()
	{
		return $this->url;
	}

	public function setIcon($value)
	{
		$this->icon->setIcon($value);
		return $this;
	}

	public function getIcon()
	{
		return $this->icon->getIcon();
	}


	public function text($text)
	{
		$this->setAttribute('title', e($text));
		return $this->append(' <span class="hidden-xs hidden-sm">' . $text . '</span>');
	}
}

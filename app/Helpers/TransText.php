<?php


class TransText
{
	private $text;
	private $args;


	public function __construct($text, $args = [])
	{
		$this->text = $text;
		$this->args = $args;
	}

	public function with($name, $value)
	{
		$this->args[$name] = $value;
		return $this;
	}

	public function __toString()
	{
		return trans($this->text, $this->args);
	}
}

class TextArray
{
	private $elements;
	private $before;
	private $after;
	private $separator;


	public function __construct($elements = [], $separator = '', $before = '', $after = '')
	{
		$this->elements = $elements;
		$this->separator = $separator;
		$this->before = $before;
		$this->after = $after;
	}

	public function separator($separator)
	{
		$this->separator = $separator;
		return $this;
	}

	public function before($before)
	{
		$this->before = $before;
		return $this;
	}

	public function after($after)
	{
		$this->after = $after;
		return $this;
	}

	public function push($element)
	{
		$this->elements[] = $element;
		return $this;
	}

	public function __toString()
	{
		return $this->before . implode($this->separator, $this->elements) . $this->after;
	}
}
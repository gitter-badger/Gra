<?php


namespace HempEmpire;
use ReflectionClass;



abstract class ClassContainer
{
	protected static $classes = [];
	protected static $for = null;
	protected $objects = [];


	public function __construct($objects = [])
	{
		$this->add($objects);
	}


	public function reset()
	{
		$this->objects = [];
	}

	protected function load($name, $args)
	{
		if($this->exists($name))
		{
			$class = static::$classes[$name];
			$reflector = new ReflectionClass($class);
			$object = $reflector->newInstanceArgs($args);


			$this->objects[] = $object;

			return true;
		}
		else
		{
			return false;
		}
	}

	protected function exists($name)
	{
		return array_key_exists($name, static::$classes);
	}

	protected function parse($string, &$name, &$args)
	{
		list($part1, $part2) = explode(':', $string, 2);

		if($this->exists($part1))
		{
			$name = $part1;

			if(!is_null($part2) && strlen($part2) > 0)
			{
				$args = explode(',', $part2);
			}
			else
			{
				$args = [];
			}

			return true;
		}
		else
		{
			$name = null;
			$args = null;
			return false;
		}
	}

	public function add($object)
	{
		if(is_array($object))
		{
			foreach($object as $element)
			{
				if($this->add($element) === false)
				{
					return false;
				}
			}

			return true;
		}
		elseif(is_string($object))
		{
			$name = null;
			$args = null;

			if($this->parse($object, $name, $args))
			{
				return $this->load($name, $args);
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}
	
	public function get()
	{
		return $this->objects;
	}

	public static function getConfig()
	{
		$buffer = '';


		foreach(static::$classes as $name => $class)
		{
			if(strlen($buffer) > 0)
				$buffer .= '<br/>';

			$class = new ReflectionClass('\\' . $class);
			$constructor = $class->getConstructor();

			$buffer .= $name . ':';
			$parameters = $constructor->getParameters();
			$first = true;

			foreach($parameters as $parameter)
			{
				$text = $parameter->getName();

				if(!$first)
					$text = ',' . $text;
				$first = false;


				if($parameter->isDefaultValueAvailable())
				{
					$text .= '=' . \Formatter::stringify($parameter->getDefaultValue());
				}

				if($parameter->isOptional())
				{
					$text = '[' . $text . ']';
				}

				$buffer .= $text;
			}
		}

		return $buffer;
	}

	public static function getDefaultPlayer()
	{
		if(empty(static::$for))
		{
			static::$for = Player::getActive();
		}

		return static::$for;
	}

	public static function setDefaultPlayer(Player $player)
	{
		static::$for = $player;
	}
}
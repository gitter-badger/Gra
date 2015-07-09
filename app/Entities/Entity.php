<?php
namespace HempEmpire\Entities;
use Exception;
use Formatter;
use Debugbar;

class Entity
{
	protected $tag = 'div';
	protected $attributes = [];
	protected $content = [];


	public function __toString()
	{
		try
		{
			return $this->render();
		}
		catch(Exception $e)
		{
			Debugbar::addException($e);
			return $e->getMessage();
		}
	}

	public function __get($name)
	{
		return $this->getAttribute($name);
	}

	public function __set($name, $value)
	{
		$this->setAttribute($name, $value);
	}

	public function __call($name, $args)
	{
		if(count($args) == 0)
		{
			if($this->hasGetter($name))
			{
				return $this->callGetter($name);
			}
			else
			{
				return $this->getAttribute($name);
			}
		}
		else
		{
			if($this->hasSetter($name))
			{
				return $this->callSetter($name, $args[0]);
			}
			else
			{
				return $this->setAttribute($name, $args[0]);
			}
		}
	}

	protected function hasGetter($name)
	{
		$method = 'get' . ucfirst($name);
		return method_exists($this, $method);
	}

	protected function hasSetter($name)
	{
		$method = 'set' . ucfirst($name);
		return method_exists($this, $method);
	}

	protected function callGetter($name)
	{
		$method = 'get' . ucfirst($name);
		return call_user_func_array([$this, $method], []);
	}

	protected function callSetter($name, $value)
	{
		$method = 'set' . ucfirst($name);
		return call_user_func_array([$this, $method], [$value]);
	}





	public function render()
	{
		return $this->renderOpen()
			. $this->renderContent()
			. $this->renderClose();
	}

	protected function renderOpen()
	{
		return '<' . $this->tag . $this->renderAttributes() . '>';
	}

	protected function renderClose()
	{
		return '</' . $this->tag . '>';
	}

	protected function renderContent()
	{
		$buffer = '';

		if(is_array($this->content))
		{
			if(count($this->content) > 0)
			{
				foreach($this->content as $content)
				{
					$buffer .= strval($content);
				}
			}
		}
		else
		{
			$buffer = strval($this->content);
		}

		return $buffer;
	}

	protected function renderAttributes()
	{
		$buffer = '';

		if(count($this->attributes) > 0)
		{
			foreach($this->attributes as $name => $value)
			{
				$buffer .= ' ' . $name . '="' . Formatter::stringify($value, false, false, ' ') . '"';
			}
		}

		return $buffer;
	}




	public function setAttribute($name, $value)
	{
		$this->attributes[$name] = $value;
		return $this;
	}

	public function getAttribute($name, $default = null)
	{
		if($this->hasAttribute($name))
		{
			return $this->attributes[$name];
		}
		else
		{
			return $default;
		}
	}

	public function hasAttribute($name)
	{
		return array_key_exists($name, $this->attributes) !== false;
	}

	public function removeAttribute($name)
	{
		if($this->hasAttribute($name))
		{
			unset($this->attributes[$name]);
		}
		return $this;
	}

	public function append($content)
	{
		array_push($this->content, $content);
		return $this;
	}

	public function prepend($content)
	{
		array_unshift($this->content, $content);
		return $this;
	}

	protected function findClass($name)
	{
		if(empty($this->attributes['class']))
			$this->attributes['class'] = [];

		return array_search($name, $this->attributes['class']);
	}

	public function addClass($name)
	{
		if(!$this->hasClass($name))
		{
			$this->attributes['class'][] = $name;
		}

		return $this;
	}

	public function removeClass($name)
	{
		if(($key = $this->findClass($name)) !== false)
		{
			unset($this->attributes['class'][$key]);
		}

		return $this;
	}

	public function hasClass($name)
	{
		return $this->findClass($name) !== false;
	}

	public function setId($id)
	{
		return $this->setAttribute('id', $id);
	}

	public function getId($name)
	{
		return $this->getAttribute($name);
	}

}

?>
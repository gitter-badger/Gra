<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{

    protected $fillable = ['name', 'image', 'visible', 'dangerous', 'components', 'properties', 'requires'];
    public $timestamps = false;
    private $_components;
    private $_properties;
    private $_requires;



	public function getPropertiesAttribute($value)
	{
		if(empty($this->_properties))
		{
			$this->_properties = json_decode($value, true);
		}

		return $this->_properties;
	}

	public function getComponentsAttribute($value)
	{
		if(empty($this->_components))
		{
			$this->_components = json_decode($value, true);

			if(is_null($this->_components))
				$this->_components = [];
		}

		return $this->_components;
	}

	public function getRequiresAttribute($value)
	{
		if(empty($this->_requires))
		{
			$this->_requires = json_decode($value);
		}
		return $this->_requires;
	}


	public function getImage()
	{
		return asset('images/places/' . $this->image);
	}

	public function getName()
	{
		return $this->name;
	}

	public function getTitle()
	{
		return trans('place.' . $this->name . '.name');
	}

	public function getDescription()
	{
		return trans('place.' . $this->name . '.description');
	}

	public function getProperty($name, $default = null)
	{
		return array_get($this->properties, $name, $default);
	}

	public function hasComponent($name)
	{
		return array_search($name, $this->components) !== false;
	}

	public function getRequirements()
	{
		return new Requirements($this->requires);
	}

	public function isVisible()
	{
		return $this->attributes['visible'];
	}

    public function isDangerous()
    {
        return $this->dangerous;
    }
}

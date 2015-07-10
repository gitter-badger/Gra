<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Contracts\Support\Renderable;
use App;
use Config;
use URL;

class LocationPlace extends Model
{
	use Timable;

	protected $fillable = ['location_id', 'place_id'];
    protected $with = ['place'];
	public $timestamps = false;
    private $_prevent;
    private $_components;


	public function location()
	{
		return $this->belongsTo(Location::class);
	}

	public function place()
	{
		return $this->belongsTo(Place::class);
	}

	public function getNameAttribute()
	{
		return $this->place->name;
	}

    public function getImage()
    {
        return $this->place->getImage();
    }

    public function getName()
    {
        return $this->place->name;
    }

    public function getTitle()
    {
        return $this->place->getTitle();
    }

    public function getDescription()
    {
        return $this->place->getDescription();
    }

    public function getProperties()
    {
        return $this->place->properties;
    }

    public function getComponents()
    {
        return $this->place->components;
    }



    public function loadComponents()
    {
    	$this->_components = [];

    	foreach($this->place->components as $name)
    	{
    		$component = App::make('component.' . $name);
            $this->_components[] = $component;

            $component->loaded($this);
    	}

        $this->_components = array_sort($this->_components, function($component)
        {
            return $component->index();
        });
    }


    public function view()
    {
        $views = [];
        $this->_prevent = false;

        foreach($this->_components as $component)
            $component->before();

        foreach($this->_components as $component)
        {
            if($this->_prevent)
                break;

            $view = $component->view();

           
            if($view instanceof Renderable)
            {
                $view = $view->render();
            }

            $views[] = $view;

        }

        foreach($this->_components as $component)
            $component->after();

        return view('place')
            ->with('place', $this)
            ->with('views', $views);
    }

    public function action(Request $request)
    {
        $this->_prevent = false;
        $action = $request->input('action');

        foreach($this->_components as $component)
            $component->before();

        foreach($this->_components as $component)
        {
            if($this->_prevent)
                break;

            $component->handle($action, $request);
        }

        foreach($this->_components as $component)
            $component->after();

        
        return redirect(URL::full());
    }

    public function prevent()
    {
    	$this->_prevent = true;
    }


	public function getProperty($name, $default = null)
	{
		return $this->place->getProperty($name, $default);
	}

    public function getRequirements()
    {
        return $this->place->getRequirements();
    }

    public function isAvailable()
    {
        return $this->place->getRequirements()->check();
    }

    public function isVisible()
    {
        return $this->place->isVisible() || $this->isAvailable();
    }
}

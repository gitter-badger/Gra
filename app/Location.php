<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use TransText;
use Formatter;
use Config;


class Location extends Model
{
	protected $fillable = ['name', 'image', 'plan', 'groups', 'x', 'y'];
	public $timestamps = false;


	public function places()
	{
		return $this->hasMany(LocationPlace::class);
	}


	public function getDistanceTo(Location $location)
	{
		$dx = $location->x - $this->x;
		$dy = $location->y - $this->y;

		return round(sqrt($dx * $dx + $dy * $dy));
	}

	public static function getStartLocation()
	{
		return static::whereName(Config::get('player.start.location'))->firstOrFail();
	}






	public function getName()
	{
		return $this->name;
	}

	public function getTitle()
	{
		return new TransText('location.' . $this->name . '.name');
	}

	public function getImage()
	{
		return asset('/images/locations/' . $this->image);
	}

	public function getPlan()
	{
		return asset('/images/plans/' . $this->plan);
	}

	public function getGroupsAttribute($value)
	{
		return json_decode($value, true);
	}

	public function is($group)
	{
		return array_search($group, $this->groups) !== false;
	}

	public function hasPlace(Place $place)
	{
		return $this->places()->where('place_id', '=', $place->id)->count() > 0;
	}

	public function findPlaceWithComponent($component)
	{
		foreach($this->places as $place)
		{
			$components = $place->getComponents();

			if(array_search($component, $components) !== false)
				return $place;
		}
		return null;
	}


	public function renderMap()
	{
		$content = '<div class="location-map" style="background: url(\'' . $this->getMap() . '\'); ">';

		foreach($this->places as $place)
		{
			$content .= '<div class="place-mark" style="left: ' . Formatter::percent($place->x) . '; top: ' . Formatter::percent($place->y) . '"></div>';
		}

		$content .= '</div>';

		return $content;
	}
}

<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;

use Session;
use Auth;



class World extends Model
{
	protected $fillable = ['open', 'timeScale'];
	private static $_selected;









	public static function getSelected()
	{
		if(is_null(static::$_selected))
		{
			$id = Session::get('world', 0);

			if($id > 0)
			{
				static::$_selected = static::find($id);
			}
		}

		return static::$_selected;
	}

	public static function setSelected($id)
	{
		if(!is_null(static::find($id)))
		{
			Session::set('world', $id);

			if(!is_null(static::$_selected))
				static::$_selected = null;

			return true;
		}
		else
		{
			return false;
		}
	}

	public static function hasSelected()
	{
		if(is_null(static::$_selected))
		{
			return Session::get('world', 0) > 0;
		}
		else
		{
			return true;
		}
	}

	public static function unsetSelected()
	{
		Session::set('world', 0);

		if(!is_null(static::$_selected))
			static::$_selected = null;
	}

	public function select()
	{
		if(isset($this->id) && $this->id > 0)
		{
			return static::setSelected($this->id);
		}
		else
		{
			return false;
		}
	}

	public function isSelected()
	{
		$selected = static::getSelected();

		return !is_null($selected) && $selected->id == $this->id;
	}




	public function players()
	{
		return $this->hasMany(Player::class);
	}

	public function gangs()
	{
		return $this->hasMany(Gang::class);
	}

	public function channel()
	{
		return $this->morphOne(Channel::class, 'owner');
	}















	public function getPopulationAttribute()
	{
		return $this->players()->count();
	}

	public function isAvailable()
	{
		if($this->open)
		{
			return true;
		}
		else
		{
			$user = Auth::user();

			if(!is_null($user))
			{
				return $user->players()->where('world_id', '=', $this->id)->count() == 1;
			}
			else
			{
				return false;
			}

		}
	}

	public function hasCharacter(User $user = null)
	{
		if(is_null($user))
			$user = Auth::user();

		return $this->players()->where('user_id', '=', $user->id)->count() > 0;
	}

	public function getName()
	{
		return $this->id;
	}

	public function getTitle()
	{
		return trans('world.' . $this->id);
	}
}

<?php
/**
 * Model postaci gracza
 *
 * @author Daniel Haba daniel.haba.kavarito@gmail.com
 * @package HempEmpire
 */


namespace HempEmpire;
use Illuminate\Database\Eloquent\Model;

use Auth;
use Config;
use TransText;


class Player extends Model
{
	use ItemContainer;
	use DispatchesMessages;

	protected $fillable = ['user_id', 'world_id', 'location_id', 'location_place_id', 'name', 'level', 'experience',
		'maxExperience',  'plantatorLevel', 'plantatorExperience', 'plantatorMaxExperience', 'smugglerLevel', 
		'smugglerExperience', 'smugglerMaxExperience', 'dealerLevel', 'dealerExperience', 'dealerMaxExperience', 
		'health', 'maxHealth', 'healthUpdate', 'energy', 'maxEnergy', 'energyUpdate', 'reload', 'wanted',
		'wantedUpdate', 'jobName', 'jobStart', 'jobEnd', 'strength', 'perception', 'endurance', 'charisma',
		'intelligence', 'agility', 'luck', 'luckUpdate', 'nextUpdate', 'statisticPoints', 'talentPoints', 'money'];



	protected $visible = ['name', 'level', 'experience', 'maxExperience',  'plantatorLevel', 'plantatorExperience', 
		'plantatorMaxExperience', 'smugglerLevel', 'smugglerExperience', 'smugglerMaxExperience', 'dealerLevel', 
		'dealerExperience', 'dealerMaxExperience', 'health', 'maxHealth', 'healthUpdate',
		'nextHealthUpdate', 'energy', 'maxEnergy', 'energyUpdate', 'nextEnergyUpdate', 'wanted', 'wantedUpdate',
		'nextWantedUpdate', 'nextLuckUpdate', 'strength', 'perception', 'charisma', 'intelligence', 'agility', 'luck',
		'luckUpdate', 'statisticPoints', 'talentPoints', 'money', 'nextUpdate', 'reportsCount', 'reload'];


	protected $appends = ['nextHealthUpdate', 'nextEnergyUpdate', 'nextWantedUpdate', 'nextLuckUpdate', 'nextUpdate', 'reportsCount'];

	public $timestamps = false;
	private static $active;







	public static function boot()
	{
		parent::boot();


		static::creating(function(Player $player)
		{
			$maxExperience = Config::get('experience.table.1');

			$player->level = 1;
			$player->experience = 0;
			$player->maxExperience = $maxExperience;


			$player->plantatorLevel = 1;
			$player->plantatorExperience = 0;
			$player->plantatorMaxExperience = $maxExperience;

			$player->smugglerLevel = 1;
			$player->smugglerExperience = 0;
			$player->smugglerMaxExperience = $maxExperience;

			$player->dealerLevel = 1;
			$player->dealerExperience = 0;
			$player->dealerMaxExperience = $maxExperience;


			$player->health = 100;
			$player->maxHealth = 100;
			$player->healthUpdate = time();

			$player->energy = 100;
			$player->maxEnergy = 100;
			$player->energyUpdate = time();

			$player->wanted = 0;
			$player->wantedUpdate = time();

			$player->jobStart = null;
			$player->jobEnd = null;

			$player->luck = Config::get('player.start.luck');
			$player->luckUpdate = time();

			$player->statisticPoints = 0;
			$player->talentPoints = 0;

			$player->money = Config::get('player.start.money');
			$player->reload = false;
		});

		static::created(function(Player $player)
		{
			$player->equipment()->create([]);

			if($player->user->players()->count() == 1)
				$player->sendReport('welcome');
			
			$player->startQuest('first-work');
		});

		static::updating(function(Player $player)
		{
			$maxLevel = Config::get('experience.max');
			$points = Config::get('player.levelup.statisticsPoints');
			$talents = Config::get('player.levelup.levelsPerTalent');

			while($player->experience >= $player->maxExperience && $player->level <= $maxLevel)
			{
				$report = $player->newReport('levelup');

				$player->level++;
				$player->health = $player->maxHealth;
				$player->energy = $player->maxEnergy;
				$player->experience -= $player->maxExperience;
				$player->maxExperience = Config::get('experience.table.' . $player->level);

				$report->param('level', $player->level)
					->param('statistics', $points);

				$player->statisticPoints += $points;

				if($player->level % $talents)
				{
					$report->param('talents', new TransText('player.newTalent'));
					$player->talentPoints++;
				}

				$report->send();
			}

			if($player->experience > $player->maxExperience)
			{
				$player->experience = $player->maxExperience;
			}



			while($player->plantatorExperience > $player->plantatorMaxExperience && $player->plantatorLevel < $player->level)
			{
				$report = $player->newReport('plantator-levelup');

				$player->plantatorLevel++;
				$player->plantatorExperience -= $player->plantatorMaxExperience;
				$player->plantatorMaxExperience = Config::get('experience.table.' . $player->plantatorLevel);

				$report->param('level', $player->plantatorLevel);

				$report->send();
			}

			if($player->plantatorExperience > $player->plantatorMaxExperience)
			{
				$player->plantatorExperience = $player->plantatorMaxExperience;
				$player->warning('plantatorMaxLevel');
			}




			while($player->smugglerExperience > $player->smugglerMaxExperience && $player->smugglerLevel < $player->level)
			{
				$report = $player->newReport('smuggler-levelup');

				$player->smugglerLevel++;
				$player->smugglerExperience -= $player->smugglerMaxExperience;
				$player->smugglerMaxExperience = Config::get('experience.table.' . $player->smugglerLevel);

				$report->param('level', $player->smugglerLevel);

				$report->send();
			}

			if($player->smugglerExperience > $player->smugglerMaxExperience)
			{
				$player->smugglerExperience = $player->smugglerMaxExperience;
				$player->warning('smugglerMaxLevel');
			}



			while($player->dealerExperience > $player->dealerMaxExperience && $player->dealerLevel < $player->level)
			{
				$report = $player->newReport('dealer-levelup');

				$player->dealerLevel++;
				$player->dealerExperience -= $player->dealerMaxExperience;
				$player->dealerMaxExperience = Config::get('experience.table.' . $player->dealerLevel);

				$report->param('level', $player->dealerLevel);

				$report->send();
			}

			if($player->dealerExperience > $player->dealerMaxExperience)
			{
				$player->dealerExperience = $player->dealerMaxExperience;
				$player->warning('dealerMaxLevel');
			}





			if($player->attributes['wanted'] >= 6 && $player->jobName != 'arrest')
			{
				$duration = $place->getProperty('arrest.duration') * 6;
				$player->startArrest($duration, false);
			}
		});
	}


	private static function loadActive()
	{
		if(empty(static::$active))
		{
			$user = Auth::user();
			$world = World::getSelected();


			if(!is_null($user) && !is_null($world))
			{
				static::$active = $user->players()->where('world_id', '=', $world->id)->first();
			}
		}
	}

	public static function getActive()
	{
		static::loadActive();

		return static::$active;
	}


	public static function hasActive()
	{
		static::loadActive();

		return !is_null(static::$active);
	}


	public function __construct(array $attributes = [])
	{
		parent::__construct($attributes);

		if($this->exists)
		{
			$this->updateHealth(false);
			$this->updateEnergy(false);
			$this->updateWanted(false);
			$this->updateLuck(flase);
			$this->save();
		}
	}




	public function world()
	{
		return $this->belongsTo(World::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function location()
	{
		return $this->belongsTo(Location::class);
	}

	public function place()
	{
		return $this->belongsTo(LocationPlace::class, 'location_place_id');
	}

	public function reports()
	{
		return $this->hasMany(Report::class);
	}

	public function quests()
	{
		return $this->hasMany(PlayerQuest::class);
	}

	public function equipment()
	{
		return $this->hasOne(PlayerEquipment::class);
	}

	public function investments()
	{
		return $this->hasMany(PlayerInvestment::class);
	}




	public function save(array $options = array())
	{
		return \DB::transaction(function() use($options)
		{
			$success = true;

			if($this->_userChanged)
			{
				$success &= $this->user->save();
				$this->_userChanged = false;
			}

			return $success && parent::save($options);
		});
	}


	public function getIsBusyAttribute()
	{
		$now = time();

		return !is_null($this->jobStart) && !is_null($this->jobEnd) && 
			$this->jobEnd > $now;
	}





	public function getNextHealthUpdateAttribute()
	{
		return null;
	}

	protected function updateHealth()
	{

	}













	/**
	 * Zwraca czas potrzebny na odnowienie jednego punktu energii
	 *
	 * @return integer Czas w sekundach
	 */
	public function getEnergyUpdateTimeAttribute()
	{
		if($this->isPremium)
		{
			if(Config::get('app.debug', false))
			{
				return 0.1;
			}
			else
			{
				return Config::get('player.energy.restore.premium');
			}
		}
		else
		{
			if(Config::get('app.debug', false))
			{
				return 5;
			}
			else
			{
				return Config::get('player.energy.restore.normal');
			}
		}
	}


	/**
	 * Zwraca czas następnego odnowienia punktu energii
	 *
	 * @return integer Czas w sekundach
	 */
	public function getNextEnergyUpdateAttribute()
	{
		if($this->energyUpdate > time() || $this->energy >= $this->maxEnergy)
		{
			return null;
		}
		else
		{
			return $this->energyUpdate + $this->energyUpdateTime;
		}
	}


	/**
	 * Zwraca energię gracza oraz aktualizuje jej stan
	 *
	 * @return void
	 */
	public function getEnergyAttribute($value)
	{
		$this->updateEnergy();
		return $value;
	}


	/**
	 * @var boolean $_energyUpdated Czy stan energi był już aktualizowany
	 */
	private $_energyUpdated = false;


	/**
	 * Aktualizuje energię dla gracza
	 *
	 * @param boolean $save Czy obiekt ma być zapisany po aktualizacji
	 * @param boolean @force Czy aktualizacja ma być wymuszona
	 * @return void
	 */
	protected function updateEnergy($save = true, $force = false)
	{
		if(!$this->_energyUpdated || $force)
		{
			$now = time();
			$last = $this->energyUpdate;
			$time = $this->energyUpdateTime;


			$interval = max($now - $last, 0);
			$updates = floor($interval / $time);


			$this->_energyUpdated = true;
			$this->attributes['energy'] = min($this->attributes['energy'] + $updates, $this->maxEnergy);
			$this->energyUpdate += $updates * $time;

			if($save)
				$this->save();
		}
	}



















	public function getWantedUpdateTimeAttribute()
	{
		$time = Config::get('player.wanted.update');

		if(Config::get('app.debug', false))
			$time /= 60;


		return $time;
	}

	public function getNextWantedUpdateAttribute()
	{
		if($this->wanted > 0)
		{
			return $this->wantedUpdate + $this->wantedUpdateTime;
		}
		else
		{
			return null;
		}
	}


	public function getWantedAttribute($value)
	{
		$this->updateWanted();
		return $value;
	}


	private $_wantedUpdated = false;
	protected function updateWanted($save = true, $force = false)
	{
		if(!$this->_wantedUpdated || $force)
		{
			$now = time();
			$last = $this->wantedUpdate;
			$time = $this->wantedUpdateTime;

			$interval = max($now - $last, 0);
			$updates = floor($interval / $time);


			$this->_wantedUpdated = true;
			$this->attributes['wanted'] = clamp($this->attributes['wanted'] - $updates, 0, 6);
			$this->wantedUpdate += $updates * $time;

			if($save)
				$this->save();
		}

	}






	public function getLuckUpdateTimeAttribute()
	{
		return Config::get('player.luck.update');
	}

	public function getNextLuckUpdateAttribute()
	{
		return $this->luckUpdate + $this->luckUpdateTime;
	}

	private $_luckUpdated = false;
	protected function updateLuck($save = true)
	{
		if(!$this->_luckUpdated)
		{
			$now = time();
			$last = $this->luckUpdate;
			$time = $this->luckUpdateTime;
			$max = Config::get('player.luck.max');
			$min = Config::get('player.luck.min');
			$change = Config::get('player.luck.change');
			$value = $this->attributes['luck'];


			if(Config::get('app.debug', false))
				$time /= 60;


			$interval = $now - $last;
			$updates = floor($interval / $time);

			for($i = 0; $i < $updates; ++$i)
			{
				$ch = mt_rand(0, $change * 2) - $change;
				$value = clamp($ch + $value, $min, $max);
			}

			$this->_luckUpdated = true;
			$this->luckUpdate += $updates * $time;
			$this->attributes['luck'] = $value;

			if($save)
				$this->save();
		}
	}

	public function getLuckAttribute($value)
	{
		$this->updateLuck();
		return $this->attributes['luck'];
	}








	public function getNextUpdateAttribute($value)
	{
		$now = time();
		$updates = [];

		if(Config::get('app.debug', false))
		{
			$updates[] = $now + 5;
		}
		else
		{
			$updates[] = $now + 60;
		}

		if(!is_null($value) && $value > $now)
			$updates[] = $value;

		if(!is_null($this->nextHealthUpdate) && $this->nextHealthUpdate > $now)
			$updates[] = $this->nextHealthUpdate;

		if(!is_null($this->nextEnergyUpdate) && $this->nextEnergyUpdate > $now)
			$updates[] = $this->nextEnergyUpdate;

		if(!is_null($this->nextWantedUpdate) && $this->nextWantedUpdate > $now)
			$updates[] = $this->nextWantedUpdate;

		if(!is_null($this->nextLuckUpdate) && $this->nextLuckUpdate > $now)
			$updates[] = $this->nextLuckUpdate;

		return min($updates) - $now;
	}











	public function getPremiumPointsAttribute()
	{
		return $this->user->premiumPoints;
	}


	private $_userChanged = false;
	public function setPremiumPointsAttribute($value)
	{
		$this->user->premiumPoints = $value;
		$this->_userChanged = true;
	}








	public function getIsPremiumAttribute()
	{
		\Debugbar::info('Premium: ', $this->user->isPremium);
		return $this->user->isPremium;
	}


	public function sendReport($type, $data = [], $date = null)
	{
		return $this->newReport($type, $date, $date)->send();
	}

	public function newReport($type, $data = [], $date = null)
	{
		if(is_null($date))
			$date = time();

		$report = new Report;
		$report->player_id = $this->id;
		$report->type = $type;
		$report->data = $data;
		$report->readed = false;
		$report->notified = false;
		$report->date = $date;

		return $report;
	}


	public function getReportsCountAttribute()
	{
		return $this->reports()->unreaded()->count();
	}




	public function roll($min, $max, $option = 0)
	{
		$r = [];
		$n = max(round(($this->luck > 50 ? $this->luck - 50 : 50 - $this->luck) / 5), 1);


		for($i = 0; $i < $n; ++$i)
			$r[$i] = mt_rand($min, $max);
	


		if($this->luck == 50)
		{
			return $r[0];
		}
		elseif($this->luck > 50)
		{
			return max($r);
		}
		elseif($this->luck < 50)
		{
			return min($r);
		}
	}

	public function completeQuest($name)
	{
		$quest = $this->quests()->whereHas('quest', function($query) use($name)
		{
			$query->whereName($name);

		})->first();

		
		if(isset($quest) && $quest->active)
		{

			$this->newReport('quest-completed')
				->param('name', new \TransText('quest.' . $name . '.name'))
				->param('text', new \TransText('quest.' . $name . '.completed'))
				->send();

			$quest->done = true;
			return $quest->save();
		}
		else
		{
			return false;
		}
	}

	public function startQuest($name)
	{
		$quest = $this->quests()->whereHas('quest', function($query) use($name)
		{
			$query->whereName($name);

		})->first();


		if(is_null($quest))
		{
			$quest = new PlayerQuest;
			$q = Quest::whereName($name)->first();

			if(isset($q))
			{
				$quest->player_id = $this->id;
				$quest->quest_id = $q->id;
				$quest->active = false;
				$quest->done = false;
			}
			else
			{
				return false;
			}

		}

		
		if(!$quest->active)
		{
			$this->newReport('quest-started')
				->param('name', new \TransText('quest.' . $name . '.name'))
				->param('text', new \TransText('quest.' . $name . '.description'))
				->send();

			$quest->active = true;
		}
		else
		{
			return false;
		}


		return $quest->save();
	}




	public function moveTo(LocationPlace $place = null, $save = true)
	{
		if(is_null($this->place) != is_null($place))
		{
			if(empty($place) || (isset($place) && $place->isAvailable()))
			{
				if(is_null($place))
				{
					$this->location_place_id = null;
					\Event::fire(new \HempEmpire\Events\PlaceLeave($this, $this->place));

				}
				else
				{
					$this->location_place_id = $place->id;
					\Event::fire(new \HempEmpire\Events\PlaceEnter($this, $place));
				}

				if($save)
				{
					return $this->save();
				}
				else
				{
					return true;
				}
			}
		}
		return false;
	}


	public function moveToArrest($save = true)
	{
		$locations = Location::with('places')->where('id', '<>', $this->location->id)->get();
		$distance = null;
		$place = null;
		$location = null;

		foreach($locations as $l)
		{
			$d = $this->location->getDistanceTo($l);

			if((is_null($distance) || $d < $distance))
			{
				$p = $l->findPlaceWithComponent('arrest');

				if(!is_null($p))
				{
					$place = $p;
					$distance = $d;
					$location = $l;
				}
			}
		}

		if(!is_null($location) && !is_null($place))
		{
			$this->location_id = $location->id;
			$this->location_place_id = $place->id;

			if($save)
			{
				return $this->save();
			}
			else
			{
				return true;
			}
		}
		else
		{
			return false;
		}
	}





	public function startJob($name, $duration, $start = null, $energyUpdate = false, $breakable = false)
	{
		if(is_null($start))
			$start = time();

		$end = $start + $duration;

		$this->jobName = $name;
		$this->jobStart = $start;
		$this->jobEnd = $end;


		if($energyUpdate)
		{
			$this->energyUpdate = $start;
		}
		else
		{
			$this->energyUpdate = $end;
		}
	}




	public function startTraveling($duration, $save = true)
	{
		$this->startJob('traveling', $duration);

		if($save)
		{
			return $this->save();
		}
		else
		{
			return true;
		}
	}

	public function startDealing($duration, $save = true)
	{
		$this->startJob('dealing', $duration);

		if($save)
		{
			return $this->save();
		}
		else
		{
			return true;
		}
	}


	public function startPlanting($duration, $save = true)
	{
		$this->startJob('planting', $duration);

		if($save)
		{
			return $this->save();
		}
		else
		{
			return true;
		}
	}

	public function startHarvesting($duration, $save = true)
	{
		$this->startJob('harvesting', $duration);

		if($save)
		{
			return $this->save();
		}
		else
		{
			return true;
		}
	}

	public function startWorking($duration)
	{
		$this->startJob('working', $duration);
	}

	public function startArrest($duration, $save = true)
	{
		if(Config::get('app.debug', false))
			$duration /= 60;




		$this->startJob('arrest', $duration, null, true);
		$this->moveToArrest(false);
		$this->wanted = 0;

		$array = new \TextArray;
		$array->separator('<br/>');

		foreach($this->getStuffs() as $stuff)
		{
			$text = new \TransText('arrest.lose');
			$text->with('name', new \TransText('item.' . $stuff->getName() . '.name'));
			$text->with('count', $stuff->getCount());

			$array->push($text);
		}

		$this->stuffs()->update(['count' => 0]);



		$this->newReport('arrested')
			->param('text', $array)
			->send();

		if($save)
		{
			return $this->save();
		}
		else
		{
			return true;
		}
	}

















}

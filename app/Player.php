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

	protected $fillable = ['user_id', 'world_id', 'location_id', 'location_place_id', 'gang_id', 'name', 'avatar', 'level', 'experience',
		'maxExperience',  'plantatorLevel', 'plantatorExperience', 'plantatorMaxExperience', 'smugglerLevel', 
		'smugglerExperience', 'smugglerMaxExperience', 'dealerLevel', 'dealerExperience', 'dealerMaxExperience', 
		'health', 'maxHealth', 'healthUpdate', 'endHealthUpdate', 'energy', 'maxEnergy', 'energyUpdate', 'reload', 'wanted',
		'wantedUpdate', 'jobName', 'jobStart', 'jobEnd', 'strength', 'perception', 'endurance', 'charisma',
		'intelligence', 'agility', 'luck', 'luckUpdate', 'nextUpdate', 'statisticPoints', 'talentPoints', 'money', 'respect',
		'weight', 'capacity', 'fbAvatar', 'todayPoints', 'lastDailyReset', 'dailyCombo'];



	protected $visible = ['name', 'level', 'experience', 'maxExperience',  'plantatorLevel', 'plantatorExperience', 
		'plantatorMaxExperience', 'smugglerLevel', 'smugglerExperience', 'smugglerMaxExperience', 'dealerLevel', 
		'dealerExperience', 'dealerMaxExperience', 'health', 'maxHealth', 'healthUpdate',
		'nextHealthUpdate', 'energy', 'maxEnergy', 'energyUpdate', 'nextEnergyUpdate', 'wanted', 'wantedUpdate',
		'nextWantedUpdate', 'nextLuckUpdate', 'strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck',
		'luckUpdate', 'statisticPoints', 'talentPoints', 'premiumPoints', 'money', 'nextUpdate', 'reportsCount', 'messagesCount', 'reload',
		'experienceModifier', 'moneyModifier', 'respect', 'weight', 'capacity', 'minDamage', 'maxDamage', 'defense', 'critChance', 'speed',
		'jobStart', 'jobEnd', 'isBusy'];


	protected $appends = ['maxHealth', 'maxEnergy', 'nextHealthUpdate', 'nextEnergyUpdate', 'nextWantedUpdate', 'nextLuckUpdate', 'nextUpdate', 'reportsCount', 'messagesCount',
		'experienceModifier', 'moneyModifier', 'weight', 'capacity', 'minDamage', 'maxDamage', 'defense', 'critChance', 'speed', 'premiumPoints', 'isBusy'];

	public $timestamps = true;
	private static $active;
	public $battleId;
	public $healthLock = false;






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

			$player->lastDailyReset = strtotime('today midnight');
		});

		static::created(function(Player $player)
		{
			$player->equipment()->create([]);

			if($player->user->players()->count() == 1)
			{
				$dialog = new ReportDialog('welcome');
				$player->pushEvent($dialog);
			}
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
				$player->energy = $player->maxEnergy;
				$player->experience -= $player->maxExperience;
				$player->maxExperience = Config::get('experience.table.' . $player->level);

				$report->param('level', $player->level)
					->param('statistics', $points);

				$player->statisticPoints += $points;

				if(($player->level % $talents) == 0)
				{
					$report->param('talents', new TransText('player.newTalent'));
					$player->talentPoints++;
				}
				else
				{
					$report->param('talents', '');
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
				$locations = Location::with('places')->get();
				$distance = null;
				$place = null;

				foreach($locations as $l)
				{
					$d = $player->location->getDistanceTo($l);

					if((is_null($distance) || $d < $distance))
					{
						$p = $l->findPlaceWithComponent('arrest');

						if(!is_null($p))
						{
							$place = $p;
							$distance = $d;
						}
					}
				}

				$duration = round($place->getProperty('arrest.duration') * $this->world->timeScale) * 6;
				$player->startArrest($duration, false);
				$player->reload = true;
			}

			if($player->attributes['health'] <= 0 && (!starts_with($player->jobName, 'healing') || $player->jobEnd <= time()))
			{
				$locations = Location::with('places')->get();
				$distance = null;
				$place = null;

				
				$locations = Location::with('places')->get();
				$distance = null;
				$place = null;
				$location = null;

				foreach($locations as $l)
				{
					$d = $player->location->getDistanceTo($l);

					if((is_null($distance) || $d < $distance))
					{
						$p = $l->findPlaceWithComponent('hospital');

						if(!is_null($p))
						{
							$place = $p;
							$distance = $d;
							$location = $l;
						}
					}
				}

				$duration = round($place->getProperty('hospital.normalSpeed') * $player->world->timeScale) * $player->maxHealth;


				$now = time();

				$player->startJob('healing-normal', $duration);
				$player->location_id = $location->id;
				$player->location_place_id = $place->id;
				$player->healthUpdate = $now;
				$player->endHealthUpdate = $now + $duration;
	

				$player->reload = true;
			}
		});
	}




	private static function loadActive()
	{
		if(empty(static::$active))
		{
			$user = Auth::user();
			$world = World::getSelected();

			//dd($user, $world);


			if(!is_null($user) && !is_null($world))
			{
				static::$active = $user->players()->where('world_id', '=', $world->id)->first();

				if(!is_null(static::$active))
				{
					static::$active->updateHealth(false);
					static::$active->updateEnergy(false);
					static::$active->updateWanted(false);
					static::$active->updateLuck(false);
					static::$active->dailyReset();
				}
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

	public function inbox()
	{
		return $this->hasMany(Mail::class, 'receiver_id')
			->where('receiver_deleted', '=', false)
			->orderBy('date', 'desc');
	}

	public function outbox()
	{
		return $this->hasMany(Mail::class, 'sender_id')
			->where('sender_deleted', '=', false)
			->orderBy('date', 'desc');
	}

	public function blacklist()
	{
		return $this->belongsToMany(Player::class, 'player_blacklist', 'player_id', 'blocked_id');
	}

	public function events()
	{
		return $this->hasMany(Event::class);
	}

	public function gang()
	{
		return $this->belongsTo(Gang::class);
	}

	public function member()
	{
		return $this->hasOne(GangMember::class);
	}

	public function invitations()
	{
		return $this->hasMany(PlayerInvitation::class);
	}

	public function talents()
	{
		return $this->hasMany(PlayerTalent::class);
	}

	public function references()
	{
		return $this->hasMany(PlayerReference::class);
	}

	public function cartels()
	{
		return $this->hasMany(PlayerCartel::class);
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


	public function getHealthUpdateTimeAttribute()
	{
		$time = null;

		if($this->attributes['health'] < $this->maxHealth && !is_null($this->place))
		{
			if($this->jobName == 'healing-normal')
			{
				$time = round($this->place->getProperty('hospital.normalSpeed') * $this->world->timeScale);
			}
			elseif($this->jobName == 'healing-fast')
			{
				$time = round($this->place->getProperty('hospital.fastSpeed') * $this->world->timeScale);
			}

		}

		return $time;
	}



	public function getNextHealthUpdateAttribute()
	{
		$time = $this->healthUpdateTime;

		if(is_null($time) || ($this->jobName != 'healing-normal' && $this->jobName == 'healing-fast') || $this->endHealthUpdate <= time())
		{
			return null;
		}
		else
		{
			return $this->healthUpdate + $time;
		}
	}

	private $_healthUpdated = false;
	protected function updateHealth($save = true, $force = false)
	{
		if(!$this->_healthUpdated || $force)
		{
			$now = min(time(), $this->endHealthUpdate);
			$last = $this->healthUpdate;
			$time = $this->healthUpdateTime;


			if(!is_null($time) && $time > 0 && !$this->healthLock)
			{
				$interval = max($now - $last, 0);
				$updates = floor($interval / $time);


				$this->_healthUpdated = true;
				$this->attributes['health'] = min($this->attributes['health'] + $updates, $this->maxHealth);
				$this->healthUpdate += $updates * $time;
			}
			else
			{
				$this->healthUpdate = time();
			}

			if($save)
				$this->save();
		}
	}

	public function getHealthAttribute($value)
	{
		$this->updateHealth();
		return $this->attributes['health'];
	}

	public function getMaxHealthAttribute()
	{
		$bonus = 0;

		for($i = 0; $i < 5; ++$i)
			if($this->hasTalent('more-health-' . ($i + 1)))
				$bonus += 10;

		return $this->attributes['maxHealth'] + $bonus;
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
			return round(Config::get('player.energy.restore.premium') * $this->world->timeScale);
		}
		else
		{
			return round(Config::get('player.energy.restore.normal') * $this->world->timeScale);
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
		return $this->attributes['energy'];
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

	public function getMaxEnergyAttribute()
	{
		$bonus = 0;

		for($i = 0; $i < 5; ++$i)
			if($this->hasTalent('more-energy-' . ($i + 1)))
				$bonus += 10;

		return $this->attributes['maxEnergy'] + $bonus;
	}



















	public function getWantedUpdateTimeAttribute()
	{
		$time = round(Config::get('player.wanted.update') * $this->world->timeScale);

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
		return round(Config::get('player.luck.update') * $this->world->timeScale);
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
		$updates = [$now + 5];



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




	public function getAvatarAttribute($value)
	{
		if(!is_null($this->user->fb_id) && $this->fbAvatar)
		{
			return '//graph.facebook.com/' . $this->user->fb_id . '/picture?type=large';
		}
		else
		{
			return asset('images/avatars/' . $value);
		}
	}

	public function getCapacity()
	{
		$capacity = Config::get('player.capacity.base') + 
			$this->level * Config::get('player.capacity.perLevel') + 
			$this->strength * Config::get('player.capacity.perStrength') +
			$this->endurance * Config::get('player.capacity.perEndurance');

		$vehicle = $this->getVehicle();

		if(isset($vehicle))
			$capacity += $vehicle->getCapacity();

		return round($capacity);
	}


	public function getWeightAttribute()
	{
		return $this->getWeight();
	}

	public function getCapacityAttribute()
	{

		return $this->getCapacity();
	}

	public function getSpaceAttribute()
	{
		return $this->capacity - $this->weight;
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
		return $this->user->isPremium;
	}




	public function getExperienceModifierAttribute()
	{
		return (100 + $this->intelligence * Config::get('player.modifier.experience')) / 100;
	}

	public function getMoneyModifierAttribute()
	{
		return (100 + $this->charisma * Config::get('player.modifier.money')) / 100;
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

	public function getMessagesCountAttribute()
	{
		return $this->inbox()->unreaded()->count();
	}




	public function roll($min, $max, $option = 0)
	{
		$r = [];
		$n = max(round(($this->luck > 50 ? $this->luck - 50 : 50 - $this->luck) / 20), 1);


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
				$quest->player_npc_id = null;
				$quest->active = false;
				$quest->done = false;
			}
			else
			{
				return false;
			}

		}

		
		if(!$quest->active && ($quest->repeatable || !$quest->done))
		{
			$this->newReport('quest-started')
				->param('name', new \TransText('quest.' . $name . '.name'))
				->param('text', new \TransText('quest.' . $name . '.description'))
				->send();

			$quest->active = true;
			$quest->starting = true;
		}
		else
		{
			return false;
		}

		$quest->init();
		$quest->finit();

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
		$locations = Location::with('places')->get();
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


	public function moveToHospital($save = true)
	{
		$locations = Location::with('places')->get();
		$distance = null;
		$place = null;
		$location = null;

		foreach($locations as $l)
		{
			$d = $this->location->getDistanceTo($l);

			if((is_null($distance) || $d < $distance))
			{
				$p = $l->findPlaceWithComponent('hospital');

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
		$this->jobBreakable = $breakable;


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
		$this->startJob('dealing', $duration, null, false, true);

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

	public function startGambling($duration, $save = true)
	{
		$this->startJob('gambling', $duration);

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
		$this->startJob('arrest', $duration, null, true, true);
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

	public function startHealing($duration, $save = true, $type = 'normal')
	{
		$now = time();

		$this->startJob('healing-' . $type, $duration, null, true, true);
		$this->healthUpdate = $now;
		$this->endHealthUpdate = $now + $duration;
		$this->moveToHospital(false);
	

		if($save)
		{
			return $this->save();
		}
		else
		{
			return true;
		}
	}

	public function startAttacking($duration, $save = true)
	{
		$now = time();

		$this->startJob('attacking', $duration);
	

		if($save)
		{
			return $this->save();
		}
		else
		{
			return true;
		}
	}








	private $_weapon;
	private $_armor;
	private $_vehicle;

	public function getWeapon()
	{
		if(empty($this->_weapon))
			$this->_weapon = $this->equipment->weapon();

		return $this->_weapon;
	}

	public function getArmor()
	{
		if(empty($this->_armor))
			$this->_armor = $this->equipment->armor();

		return $this->_armor;
	}

	public function getVehicle()
	{
		if(empty($this->_vehicle))
			$this->_vehicle = $this->equipment->vehicle();

		return $this->_vehicle;
	}

	public function getDamage()
	{
		$weapon = $this->getWeapon();
		$minDamage = 0;
		$maxDamage = 0;

		if(is_null($weapon))
		{
			$minDamage = floor($this->strength / 10);
			$maxDamage = floor($this->strength / 5) + 1;
		}
		else
		{
			list($minDamage, $maxDamage) = $weapon->getDamage();
			$type = $weapon->getSubType();

			if($type == 'melee')
			{
				$minDamage += floor($this->strength / 10);
				$maxDamage += floor($this->strength / 5) + 1;
			}
			elseif($type == 'ranged')
			{
				$minDamage += floor($this->perception / 10);
				$maxDamage += floor($this->perception / 5) + 1;
			}
		}

		if(!is_null($this->gang))
		{
			$bonus = (100 + $this->gang->attackLevel * Config::get('gang.bonus.damage')) / 100;
			$minDamage = round($minDamage * $bonus);
			$maxDamage = round($maxDamage * $bonus);
		}

		return [$minDamage, $maxDamage];
	}

	public function getDefense()
	{
		$armor = $this->getArmor();
		$defense = floor($this->endurance / 5);

		if(!is_null($armor))
			$defense += $armor->getArmor();



		if(!is_null($this->gang))
		{
			$bonus = (100 + $this->gang->defenseLevel * Config::get('gang.bonus.defense')) / 100;
			$defense = round($defense * $bonus);
		}

		return $defense;
	}

	public function getSpeed()
	{
		$speed = 1.0;

		$weapon = $this->getWeapon();
		$armor = $this->getArmor();

		if(!is_null($weapon))
			$speed += $weapon->getSpeed();

		if(!is_null($armor))
			$speed += $armor->getSpeed();


		return $this->agility * $speed;
	}

	public function getCritChance()
	{
		$weapon = $this->getWeapon();

		if(is_null($weapon))
		{
			return 0;
		}
		else
		{
			return round($weapon->getCritChance() * 10000) / 100;
		}
	}

	public function rollHit()
	{
		return mt_rand(0, $this->perception);
	}

	public function rollDodge()
	{
		return mt_rand(0, $this->agility);
	}


	public function rollCrit()
	{
		$chance = $this->getCritChance();

		return (100 - $this->roll(0, 99)) < round($chance);
	}

	public function rollDamage()
	{
		list($minDamage, $maxDamage) = $this->getDamage();

		return $this->roll($minDamage, $maxDamage);
	}


	public function getMinDamageAttribute()
	{
		return $this->getDamage()[0];
	}

	public function getMaxDamageAttribute()
	{
		return $this->getDamage()[1];
	}

	public function getDefenseAttribute()
	{
		return $this->getDefense();
	}

	public function getSpeedAttribute()
	{
		return $this->getSpeed();
	}

	public function getCritChanceAttribute()
	{
		return $this->getCritChance();
	}

























	public function pullEvent()
	{
		$event = null;

		do
		{
			$event = array_shift($this->events);
		}
		while(!is_null($event) && !$event->ready());


		if($event->done())
			$event->delete();

		return $event;
	}

	public function pushEvent($object)
	{
		$this->events()->create([

			'player_id' => $this->id,
			'object' => serialize($object),
		]);
	}

	public function renderEvents()
	{
		$output = '';

		foreach($this->events as $event)
		{
			if($event->ready())
			{
				$output .= $event->render();
			}

			if($event->done())
			{
				$event->delete();
			}
		}

		return $output;
	}



	private $_talents;
	public function hasTalent($name)
	{
		if(empty($this->_talents))
		{
			$this->_talents = [];

			foreach($this->talents as $talent)
			{
				$this->_talents[$talent->name] = true;
			}
		}

		return isset($this->_talents[$name]) ? true : false;
	}


	public function givePremiumPoint()
	{
		if($this->todayPoints < Config::get('player.premium.dailyPoints'))
		{
			if(mt_rand(0, 100) < Config::get('player.premium.chance'))
			{
				$this->user->premiumPoints++;
				$this->todayPoints++;

				return $this->user->save() && $this->save();
			}
		}

		return true;
	}

	public function dailyReset()
	{
		\DB::transaction(function() 
		{
			$tick = 24 * 3600;
			$interval = time() - $this->lastDailyReset;
			$ticks = floor($interval / $tick);
			$event = new \HempEmpire\Events\DailyReset($this);

			for($i = 0; $i < $ticks; ++$i)
			{
				$this->lastDailyReset += $tick;
				\Event::fire($event);
			}

			return $this->save();
		});

	}


	public function meetCartel($name)
	{
		$cartel = Cartel::whereName($name)->first();

		if(!is_null($cartel))
		{
			$cartel = PlayerCartel::firstOrNew([

				'player_id' => $this->id,
				'cartel_id' => $cartel->id,
			]);

			if(!$cartel->exists)
			{
				$cartel->respect = 0;
				$cartel->save();
			}
		}
	}

	public function giveRespectToCartel($name, $respect)
	{
		$cartel = Cartel::whereName($name)->first();

		if(!is_null($cartel))
		{
			$cartel = PlayerCartel::firstOrNew([

				'player_id' => $this->id,
				'cartel_id' => $cartel->id,
			]);

			if(!$cartel->exists)
			{
				$cartel->respect = 0;
			}

			$cartel->respect += $respect;
			$cartel->save();
		}
	}

	public function getCartelRespect($name)
	{
		$cartel = Cartel::whereName($name)->first();

		if(!is_null($cartel))
		{
			$cartel = PlayerCartel::first([

				'player_id' => $this->id,
				'cartel_id' => $cartel->id,
			]);

			return $cartel->respect;
		}

		return null;
	}

	public function getCartelReputation($name)
	{
		$cartel = Cartel::whereName($name)->first();

		if(!is_null($cartel))
		{
			$cartel = PlayerCartel::first([

				'player_id' => $this->id,
				'cartel_id' => $cartel->id,
			]);

			return $cartel->reputation;
		}

		return null;
	}





}

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
		'health', 'maxHealth', 'healthUpdate', 'energy', 'maxEnergy', 'energyUpdate', 'wanted',
		'wantedUpdate', 'jobName', 'jobStart', 'jobEnd', 'strength', 'perception', 'endurance', 'charisma',
		'intelligence', 'agility', 'luck', 'luckUpdate', 'nextUpdate', 'statisticPoints', 'talentPoints', 'money'];



	protected $visible = ['name', 'level', 'experience', 'maxExperience',  'plantatorLevel', 'plantatorExperience', 
		'plantatorMaxExperience', 'smugglerLevel', 'smugglerExperience', 'smugglerMaxExperience', 'dealerLevel', 
		'dealerExperience', 'dealerMaxExperience', 'health', 'maxHealth', 'healthUpdate',
		'nextHealthUpdate', 'energy', 'maxEnergy', 'energyUpdate', 'nextEnergyUpdate', 'wanted', 'wantedUpdate',
		'nextWantedUpdate', 'nextLuckUpdate', 'strength', 'perception', 'charisma', 'intelligence', 'agility', 'luck',
		'luckUpdate', 'statisticPoints', 'talentPoints', 'money', 'nextUpdate', 'reportsCount'];


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
		});

		static::created(function(Player $player)
		{
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



			while($player->plantatorExperience >= $player->plantatorMaxExperience && $player->plantatorLevel < $player->level)
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




			while($player->smugglerExperience >= $player->smugglerMaxExperience && $player->smugglerLevel < $player->level)
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



			while($player->dealerExperience >= $player->dealerMaxExperience && $player->dealerLevel < $player->level)
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
		if($this->isBusy || $this->energy >= $this->maxEnergy)
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
	public function getEnergyAttribute()
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



















	public function getWantedUpdateTimeAttribute()
	{
		return Config::get('player.wanted.update');
	}

	public function getNextWantedUpdateAttribute()
	{
		return null;
		return $this->wantedUpdate + $this->wantedUpdateTime;
	}

	protected function updateWanted()
	{

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




}

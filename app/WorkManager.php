<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use DB;

class WorkManager extends Model
{
    protected $fillable = ['player_id', 'location_place_id', 'lastUpdated', 'lastReseted'];
    public $timestamps = false;
    private $_works;
    private $_reset;
    private $_resetable;
    private $_at;
    private $_per;
    private $_groups;
    private $_cooldown;





    public function player()
    {
    	return $this->blongsTo(Player::class);
    }

    public function place()
    {
    	return $this->belongsTo(LocationPlace::class);
    }

    public function states()
    {
    	return $this->hasMany(WorkState::class, 'manager_id');
    }




    public function setResetable($resetable)
    {
        $this->_resetable = $resetable;
    }

    public function setResetInterval($reset)
    {
        $this->_reset = $reset;
    }

    public function setWorksAtOnce($atOnce)
    {
        $this->_at = $atOnce;
    }

    public function setWorksPerGroup($perGroup)
    {
        $this->_per = $perGroup;
    }

    public function setGroups($groups)
    {
        $this->_groups = $groups;
    }

    public function setResetCooldown($cooldown)
    {
        $this->_cooldown = $cooldown;
    }




    private function _rollWorks()
    {
        return DB::transaction(function()
        {
            $this->states()->update(['active' => false]);



            $groups = WorkGroup::whereIn('name', $this->_groups)->with('works')->get();
            $order = 0;

            foreach($groups as $group)
            {
                $works = $group->works;

                for($i = 0; $i < $this->_per; ++$i)
                {
                    if(count($works) > 0)
                    {
                        $index = mt_rand(0, count($works) - 1);
                        $work = $works[$index];
                        $works->pull($index);
                        $works = $works->values();

                        $state = $this->states()->firstOrNew([

                            'work_id' => $work->id,
                        ]);

                        $state->active = true;
                        $state->order = $order++;
                        

                        if(!$state->save())
                            return false;

                    }
                }
            }

            $this->lastUpdated = time();
            return $this->save();
        });
    }




    public function reset($force = false)
    {
        if($force || $this->isResetAvailable())
        {
            $this->lastReseted = time();
            return $this->_rollWorks();
        }
        else
        {
            return false;
        }
    }

    public function refresh($force = false)
    {
        if($force || $this->needsUpdate())
        {
            return $this->_rollWorks();
        }
        else
        {
            return false;
        }
    }

    private function _loadWorks()
    {
        if(empty($this->_works))
        {
            $works = $this->states()->where('active', '=', true)
                ->orderBy('order', 'asc')->take($this->_at)->with('work')->get();


            $this->_works = collect([]);


            foreach($works as $work)
                $this->_works[$work->work->id] = $work;
        }

        return is_array($this->_works);
    }


    public function getWorks()
    {
        $this->_loadWorks();

        //dd($this->_works);

        return $this->_works->map(function($state)
        {
            return $state->work;       
        });
    }

    public function findWork($id)
    {
        $this->_loadWorks();

        if(isset($this->_works[$id]))
        {
            return $this->_works[$id];
        }
        else
        {
            return null;
        }
    }


    public function getLastUpdate()
    {
        return $this->lastUpdated;
    }

    public function getNextUpdate()
    {
        return $this->lastUpdated + $this->_reset;
    }

    public function getLastReset()
    {
        if($this->_resetable)
        {
            return $this->lastReseted;
        }
        else
        {
            return null;
        }
    }

    public function getResetAvailable()
    {
        if($this->_resetable)
        {
            return $this->lastReseted + $this->_cooldown;
        }
        else
        {
            return null;
        }
    }

    public function needsUpdate()
    {
        //return true;
        return ($this->getNextUpdate() < time() && !is_null($this->_reset)) || ($this->getLastUpdate() == 0 && is_null($this->_reset));
    }

    public function isResetAvailable()
    {
        return $this->_resetable && is_null($this->lastReseted) || $this->getResetAvailable() < time();
    }


    public function isResetable()
    {
        return $this->_resetable && !is_null($this->_reset);
    }
}

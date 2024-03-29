<?php

namespace HempEmpire;

use Illuminate\Database\Eloquent\Model;
use BootForm;

class PlayerQuest extends Model
{
    protected $fillable = ['quest_id', 'player_id', 'player_npc_id', 'active', 'done', 'states', 'starting'];
    public $timestamps = false;
    private $_states;
    private $_changed = false;


    public static function boot()
    {
        parent::boot();

        static::updating(function(PlayerQuest $quest)
        {
            $quest->init();

            if($quest->active && $quest->starting)
            {
                $quest->starting = false;
                if(!$quest->start())
                    return false;
            }


            if($quest->active && !$quest->done && $quest->check())
            {
                if($quest->auto)
                {
                    $quest->done = true;
                    $quest->active = false;

                    $quest->player->newReport('quest-completed')
                        ->param('name', new \TransText('quest.' . $quest->quest->name . '.name'))
                        ->param('text', new \TransText('quest.' . $quest->quest->name . '.completed'))
                        ->send();

                    $dialog = (new ReportDialog('quest-completed'))
                        ->with('name', new \TransText('quest.' . $quest->quest->name . '.name'))
                        ->with('text', new \TransText('quest.' . $quest->quest->name . '.completed'));

                    $quest->player->reload = true;
                    $quest->player->pushEvent($dialog);
                    $quest->player->save();

                    return $quest->give();
                }
                else
                {
                    $quest->active = true;
                }
            }
        });
    }

    public function getRepeatableAttribute()
    {
        return $this->quest->repeatable;
    }

    public function getBreakableAttribute()
    {
        return $this->quest->breakable;
    }

    public function getAutoAttribute()
    {
        return $this->quest->auto;
    }



    public function quest()
    {
    	return $this->belongsTo(Quest::class);
    }

    public function player()
    {
    	return $this->belongsTo(Player::class);
    }

    public function npc()
    {
        return $this->belongsTo(PlayerNpc::class, 'player_npc_id');
    }


    public function getName()
    {
        return $this->quest->getName();
    }

    public function getTitle()
    {
        return $this->quest->getTitle();
    }

    public function getDescription()
    {
        return $this->quest->getDescription();
    }

    public function getCompleted()
    {
        return $this->quest->getComplete();
    }



    public function getStatesAttribute($value)
    {
        if(empty($this->_states))
        {
            if(is_null($value))
            {
                $o = $this->quest->getObjectives();
                //dd($o);

                $this->_states = $this->quest->getObjectives()->get();
                $this->_changed = true;
            }
            else
            {
                $this->_states = unserialize($value);
            }
        }

        return $this->_states;
    }


    public function changed()
    {
        if($this->_changed)
            return true;

        foreach($this->states as $state)
        {
            if($state->changed())
                return true;
        }

        return false;
    }


    private $_init = false;
    public function init()
    {
        if(!$this->_init)
        {
            foreach($this->states as $state)
            {
                $state->setup($this->player);
            }

            $this->_init = true;
        }
    }


    public function finit()
    {
        if($this->_init && $this->changed())
        {
            $this->states = serialize($this->states);
            $this->save();

            $this->_changed = false;
        }
    }


    public function check()
    {
        $this->init();

        if(count($this->states) == 0)
            return true;

        foreach($this->states as $state)
        {
            if(!$state->check())
                return false;
        }
        return true;
    }

    public function render()
    {
        $this->init();
        $content = BootForm::openHorizontal(['xs' => [4, 8]])->get();

        foreach($this->states as $state)
            $content .= $state->render();

        $content .= BootForm::close();


        return $content;
    }

    public function give($save = true)
    {
        if($this->check())
        {
            return $this->quest->getRewards()->give($this->player, $save);
        }
        else
        {
            return false;
        }
    }

    public function start($save = true)
    {
        return $this->quest->getAccept()->give($this->player, $save);
    }



}

<?php

namespace HempEmpire;


trait Timable
{
	public function timers()
	{
		return $this->morphMany(Timer::class, 'owner');
	}
}
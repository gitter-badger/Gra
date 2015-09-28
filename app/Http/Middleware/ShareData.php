<?php

namespace HempEmpire\Http\Middleware;

use Closure;
use View;
use HempEmpire\Player;
use HempEmpire\World;


class ShareData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        //dd(Player::hasActive(), Player::getActive());
        View::share('player', Player::getActive());
        View::share('world', World::getSelected());
        return $next($request);
    }
}

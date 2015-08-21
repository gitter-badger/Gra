<?php

namespace HempEmpire\Http\Middleware;

use Closure;
use View;
use HempEmpire\Player;


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
        return $next($request);
    }
}

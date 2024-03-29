<?php

namespace HempEmpire\Http\Middleware;

use Closure;
use Auth;

use HempEmpire\Player;



class PlayerRequired
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
        if(Player::hasActive())
        {
            return $next($request);
        }
        else
        {
            return (redirect()->route('player.create'));
        }
    }
}

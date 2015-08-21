<?php

namespace HempEmpire\Http\Middleware;

use Closure;
use HempEmpire\Player;

class WithoutCharacter
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
            return redirect()->route('game');
        }
        else
        {
            return $next($request);
        }
    }
}

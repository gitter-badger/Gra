<?php

namespace HempEmpire\Http\Middleware;

use Closure;
use Auth;

class IsBanned
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
        if(Auth::user()->isBanned)
        {
            return $next($request);
        }
        else
        {
            return redirect()->route('game');
        }

    }
}

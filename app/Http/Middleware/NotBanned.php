<?php

namespace HempEmpire\Http\Middleware;

use Closure;
use Auth;

class NotBanned
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
            return redirect()->route('user.banned');
        }
        else
        {
            return $next($request);
        }
    }
}

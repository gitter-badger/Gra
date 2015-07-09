<?php

namespace HempEmpire\Http\Middleware;

use Closure;
use HempEmpire\World;

class SelectWorld
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
        if(World::hasSelected())
        {
            return $next($request); 
        }
        else
        {
            return redirect(route('world.list'));
        }
    }
}

<?php

namespace HempEmpire\Http\Middleware;

use Closure;
use Auth;

class AdminOnly
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
        $user = Auth::user();

        if($user->admin)
        {
            return $next($request);
        }
        else
        {
            if($request->ajax())
            {
                return response('Unauthorized.', 401);
            }
            else
            {
                return redirect(route('home'));
            }
        }
    }
}

<?php

namespace HempEmpire\Http\Middleware;

use Closure;
use Message;
use Illuminate\Contracts\Auth\Guard;
use Auth;
use Session;


class Verification
{
    private $auth;

    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }



    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if($this->auth->user()->verified)
        {
            return $next($request);
        }
        else
        {
            Auth::logout();
            Session::flush();
            Message::danger('notVerified');
            
            return redirect()->guest(route('home'));
        }
    }
}

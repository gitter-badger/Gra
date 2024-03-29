<?php

namespace HempEmpire\Http\Middleware;

use App;
use Config;
use Closure;
use Illuminate\Contracts\Auth\Guard;

class SetLanguage
{
    protected $auth;



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
        //dd($request->hasCookie('lang'), $request->cookie('lang'));



        if($this->auth->check())
        {
            App::setLocale($this->auth->user()->language);
        }
        elseif($request->hasCookie('lang'))
        {
            $lang = $request->cookie('lang');

            if(array_search($lang, Config::get('app.languages')) !== false)
            {
                App::setLocale($lang);
            }
            else
            {
                App::setLocale(Config::get('app.fallback_locale'));
            }
        }
        else
        {
            $found = false;
            $langs = explode(',', $request->server('HTTP_ACCEPT_LANGUAGE'));


            foreach($langs as $lang)
            {
                $pos1 = strpos($lang, ';');
                $pos2 = strpos($lang, '-');

                $pos = [];

                if($pos1 !== false)
                    $pos[] = $pos1;

                if($pos2 !== false)
                    $pos[] = $pos2;

                if(count($pos) === 0)
                    $pos[] = false;

                $pos = min($pos);


                if($pos !== false)
                    $lang = substr($lang, 0, $pos);

                if(array_search($lang, Config::get('app.languages')) !== false)
                {
                    $found = true;
                    App::setLocale($lang);
                    break;
                }
            }

            if(!$found)
            {
                App::setLocale(Config::get('app.fallback_locale'));
            }
        }



        return $next($request);
    }
}

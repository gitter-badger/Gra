<?php

namespace HempEmpire\Http\Middleware;

use Closure;
use Config;

class MinifyHTML
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
        if(Config::get('app.debug', false) !== false)
        {
            $response = $next($request);
            $content = $response->getContent();

            $search = array(
                '/\>[^\S ]+/s', // strip whitespaces after tags, except space
                '/[^\S ]+\</s', // strip whitespaces before tags, except space
                '/(\s)+/s'       // shorten multiple whitespace sequences
            );

            $replace = array(
                '>',
                '<',
                '\\1'
            );

            $buffer = preg_replace($search, $replace, $content);
            return $response->setContent($buffer);
        }
        else
        {
            return $next($request);
        }
    }
}

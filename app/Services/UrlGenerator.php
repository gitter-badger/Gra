<?php

namespace HempEmpire\Services;
use Illuminate\Contracts\Routing\UrlGenerator as UrlGeneratorContract;
use Illuminate\Routing\UrlGenerator as BaseUrlGenerator;

use Illuminate\Http\Request;
use Session;




class UrlGenerator extends BaseUrlGenerator
{

    /**
     * Get the URL for a given route instance.
     *
     * @param  \Illuminate\Routing\Route  $route
     * @param  mixed  $parameters
     * @param  bool   $absolute
     * @return string
     */
    protected function toRoute($route, $parameters, $absolute)
    {
        if(array_search('server', $route->parameterNames()) !== false)
        {
            if(Session::has('world') && empty($parameters['server']))
            {
                $parameters['server'] = 's' . Session::get('world');
            }
        }


        return parent::toRoute($route, $parameters, $absolute);
    }


    protected function extendsParameters(&$parameters)
    {
        if(Session::has('world'))
        {

            if(empty($parameters['server']))
                $parameters['server'] = 's' . Session::get('world'); 
        }
        else
        {
            unset($parameters['server']);
        }
    }
}

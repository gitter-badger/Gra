<?php

namespace HempEmpire\Services;
use Illuminate\Routing\Redirector as BaseRedirector;
use Session;

class Redirector extends BaseRedirector
{

    /**
     * Create a new redirect response to a named route.
     *
     * @param  string  $route
     * @param  array   $parameters
     * @param  int     $status
     * @param  array   $headers
     * @return \Illuminate\Http\RedirectResponse
     */
    public function route($route, $parameters = [], $status = 302, $headers = [])
    {
    	$this->extendsParameters($parameters);
    	return parent::route($route, $parameters, $status, $headers);
    }

    /**
     * Create a new redirect response to a controller action.
     *
     * @param  string  $action
     * @param  array   $parameters
     * @param  int     $status
     * @param  array   $headers
     * @return \Illuminate\Http\RedirectResponse
     */
    public function action($action, $parameters = [], $status = 302, $headers = [])
    {
    	$this->extendsParameters($parameters);
    	return parent::action($action, $parameters, $status, $headers);
    }

    protected function extendsParameters(&$parameters)
    {
    	$parameters['world'] = Session::get('world');
    }
}

<?php


function entity($name = null)
{
	if(is_null($name))
		$name = 'Entity';

	$namespace = 'HempEmpire\Entities\\';
	$class = $namespace . ucfirst($name);

	//dd($class);

	if(class_exists($class))
	{
		return new $class;
	}
	else
	{
		$class = $namespace . 'Entity';
		return new $class;
	}
}


?>
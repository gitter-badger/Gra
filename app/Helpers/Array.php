<?php
use Illuminate\Pagination\LengthAwarePaginator;


function array_join()
{
	$result = [];
	$arrays = func_get_args();


	foreach($arrays as $array)
	{
		foreach($array as $element)
		{
			$result[] = $element;
		}
	}

	return $result;
}

function array_paginate($array, $perPage, $url = null)
{
	$page = Request::input('page', 1);

	if(is_null($url))
		$url = Request::url();

	$count = count($array);
	$slice = array_slice($array, $page * $perPage, $perPage);


	return (new LengthAwarePaginator($slice, $count, $perPage))
		->setPath($url);
}


function explode_trim($separator, $string)
{
	$array = explode($separator, $string);

	foreach($array as &$element)
		$element = trim($element);

	return $array;
}


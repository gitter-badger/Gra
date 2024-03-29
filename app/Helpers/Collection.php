<?php
use Illuminate\Pagination\LengthAwarePaginator;




function collection_join()
{
	$result = collect([]);
	$arrays = func_get_args();


	foreach($arrays as $array)
	{
		foreach($array as $element)
		{
			$result->push($element);
		}
	}

	return $result;
}

function collection_paginate($array, $perPage, $url = null, $page = 'page')
{
	$page = Request::input($page, 1);

	if(is_null($url))
		$url = Request::url();

	$count = $array->count();
	$slice = $array->forPage($page, $perPage);


	return (new LengthAwarePaginator($slice, $count, $perPage))
		->setPath($url);
}

<?php


function isCurrentUrl($url)
{
	$current = Request::url();
	return !is_null($url) && starts_with($current, $url);
}

function isCurrentRoute($route)
{
	return isCurrentUrl(route($route));
}
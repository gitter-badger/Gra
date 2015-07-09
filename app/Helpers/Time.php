<?php

function duration_to_time($duration)
{
	if(preg_match('/([0-9]+d)?\s*([0-9]+h)?\s*([0-9]+m)?\s*([0-9]+s)?/i', $duration, $matches))
	{
		$d = 0;
		$h = 0;
		$m = 0;
		$s = 0;

		if(isset($matches[1]))
			$d = intval(substr($matches[1], 0, -1));
		if(isset($matches[2]))
			$h = intval(substr($matches[2], 0, -1));
		if(isset($matches[3]))
			$m = intval(substr($matches[3], 0, -1));
		if(isset($matches[4]))
			$s = intval(substr($matches[4], 0, -1));
		

		return (($d * 24 + $h) * 60 + $m) * 60 + $s;
	}
	else
	{
		throw new Exception('Zły format czasu');
	}
}

function time_to_duration($time)
{
	$left = $time;
	$s = $left % 60;
	$left = ($left - $s) / 60;
	$m = $left % 60;
	$left = ($left - $m) / 60;
	$h = $left % 60;
	$left = ($left - $h) / 24;
	$d = $left;

	$string = '';

	if($d > 0)
	{
		$string .= "{$d}d";
	}

	if($h > 0)
	{
		if(strlen($string) > 0)
		{
			$string .= ' ';
		}
		$string .= "{$h}h";
	}

	if($m > 0)
	{
		if(strlen($string) > 0)
		{
			$string .= ' ';
		}
		$string .= "{$m}m";
	}

	if($s > 0)
	{
		if(strlen($string) > 0)
		{
			$string .= ' ';
		}
		$string .= "{$s}s";
	}

	return $string;
}
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
	$ds = 24 * 3600;
	$hs = 3600;
	$ms = 60;

	$d = floor($left / $ds);
	$left -= $d * $ds;
	$h = floor($left / $hs);
	$left -= $h * $hs;
	$m = floor($left / $ms);
	$left -= $m * $ms;
	$s = $left;



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
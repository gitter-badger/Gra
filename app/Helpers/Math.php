<?php


function clamp($value, $min, $max)
{
	return max(min($value, $max), $min);
}


function lerp($value, $a, $b)
{
	$value = clamp($value, 0, 1);
	return (1.0 - $value) * $a + $value * $b;
}
<?php


function clamp($value, $min, $max)
{
	return max(min($value, $max), $min);
}
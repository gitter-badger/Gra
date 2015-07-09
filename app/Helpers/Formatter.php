<?php


class Formatter
{
	public static function time($value)
	{
		$text = '';
		$current = $value;

		if($current >= 24 * 3600)
		{
			$days = floor($current / (24 * 3600));
			$current -= $days * 24 * 3600;

			$text .= $days . trans('formatter.days');
		}
		if($current >= 3600)
		{
			if(strlen($text))
				$text .= ' ';

			$hours = floor($current / 3600);
			$current -= $hours * 3600;

			$text .=  $hours . trans('formatter.hours');
		}
		if($current >= 60)
		{
			if(strlen($text))
				$text .= ' ';

			$minutes = floor($current / 60);
			$current -= $minutes * 60;

			$text .= $minutes . trans('formatter.minutes');
		}
		if($current > 0)
		{
			if(strlen($text))
				$text .= ' ';

			$text .= $current . trans('formatter.seconds');
		}

		if($value <= 0)
		{
			$text = trans('formatter.instant');
		}

		return $text;
	}

	public static function money($value)
	{
		return '$' . $value;
	}

	public static function boolean($value)
	{
		if($value)
		{
			return trans('formatter.yes');
		}
		else
		{
			return trans('formatter.no');
		}
	}

	public static function signed($value)
	{
		if($value >= 0)
		{
			return '+' . abs($value);
		}
		else
		{
			return '-' . abs($value);
		}
	}

	public static function number($value, $precision = 0)
	{
		$n = pow(10, $precision);

		return round($value * $n) / $n;
	}

	public static function percent($value, $precision = 0)
	{
		return static::number($value * 100, $precision) . '%';
	}

	public static function signedPercent($value, $precision = 0)
	{
		return static::signed(static::number($value, $precision)) . '%';
	}

	public static function signedMoney($value)
	{
		return '$' . static::signed($value);
	}


	public static function stringify($value, $quote = true, $keys = true, $separator = ', ')
	{
		if(is_null($value))
		{
			return 'null';
		}
		elseif(is_bool($value))
		{
			return $value ? 'true' : 'false';
		}
		elseif(is_numeric($value))
		{
			return $value;
		}
		elseif(is_string($value))
		{
			if($quote)
			{
				return '\'' . e($value) . '\'';
			}
			else
			{
				return e($value);
			}
		}
		elseif(is_array($value))
		{
			$buffer = '';
			$first = true;

			foreach($value as $key => $subvalue)
			{
				if(!$first)
					$buffer .= $separator;

				$first = false;

				if($keys && is_string($key))
					$buffer .= self::stringify($key, $quote) . ' => ';


				$buffer .= self::stringify($subvalue, $quote, $keys, $separator);
			}


			if($quote)
			{
				return '[' . $buffer . ']';
			}
			else
			{
				return $buffer;
			}
		}
	}
}
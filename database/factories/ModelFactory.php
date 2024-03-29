<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

if(!function_exists('property_get'))
{
    function property_get($subject, $property, $default = null)
    {
        return property_exists($subject, $property) ? $subject->$property : $default;
    }  
}

$factory->define(HempEmpire\User::class, function ($faker)
{
    return [
        'email' => property_get($faker, 'email', str_random(8) . '@test.com'),
        'password' => property_get($faker, 'password', str_random(10)),
        'newsletter' => property_get($faker, 'newsletter', false),
        'remember_token' => str_random(10),
        'registration_ip' => '127.0.0.1',
    ];
});


$factory->define(HempEmpire\World::class, function($faker)
{
	return [

		'open' => property_get($faker, 'open', true),
	];
});

$factory->define(HempEmpire\Player::class, function($faker)
{
    return [

        'name' => property_get($faker, 'name', str_random(8)),
        'strength' => property_get($faker, 'strength', mt_rand(0, 5)),
        'perception' => property_get($faker, 'perception', mt_rand(0, 5)),
        'endurance' => property_get($faker, 'endurance', mt_rand(0, 5)),
        'charisma' => property_get($faker, 'charisma', mt_rand(0, 5)),
        'intelligence' => property_get($faker, 'intelligence', mt_rand(0, 5)),
        'agility' => property_get($faker, 'agility', mt_rand(0, 5)),

    ];
});


$factory->define(HempEmpire\Location::class, function($faker)
{
    $distance = property_get($faker, 'distance', mt_rand(0, 250));
    $angle = deg2rad(mt_rand(0, 360));
    $x = sin($angle) * $distance;
    $y = -cos($angle) * $distance;


    return [

        'name' => property_get($faker, 'name', str_random(8)),
        'x' => $x,
        'y' => $y,
    ];
});



$factory->define(HempEmpire\Place::class, function($faker)
{
    return [

        'name' => property_get($faker, 'name', str_random(8)),
        'components' => json_encode(property_get($faker, 'components', [])),
        'properties' => json_encode(property_get($faker, 'properties', [])),
    ];
});

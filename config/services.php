<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, Mandrill, and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => '',
        'secret' => '',
    ],

    'mandrill' => [
        'secret' => '',
    ],

    'ses' => [
        'key' => '',
        'secret' => '',
        'region' => 'us-east-1',
    ],

    'stripe' => [
        'model'  => HempEmpire\User::class,
        'key' => '',
        'secret' => '',
    ],


    'facebook' => [

        'client_id' => '1047120088637523',
        'client_secret' => '15595b71fe99fb60437ad56e02e2deba',
        'redirect' => 'http://' . env('APP_DOMAIN') . '/auth/facebook/callback',
    ],

];

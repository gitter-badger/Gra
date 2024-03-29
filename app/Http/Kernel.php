<?php

namespace HempEmpire\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * @var array
     */
    protected $middleware = [
        \Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode::class,
        \HempEmpire\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \HempEmpire\Http\Middleware\VerifyCsrfToken::class,
        \HempEmpire\Http\Middleware\ShareData::class,
        \HempEmpire\Http\Middleware\SetLanguage::class,
        //\HempEmpire\Http\Middleware\MinifyHTML::class,
    ];

    /**
     * The application's route middleware.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'auth' => \HempEmpire\Http\Middleware\Authenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'guest' => \HempEmpire\Http\Middleware\RedirectIfAuthenticated::class,
        'world' => \HempEmpire\Http\Middleware\SelectWorld::class,
        'player' => \HempEmpire\Http\Middleware\PlayerRequired::class,
        'noplayer' => \HempEmpire\Http\Middleware\WithoutCharacter::class,
        'admin' => \HempEmpire\Http\Middleware\AdminOnly::class,
        'verified' => \HempEmpire\Http\Middleware\Verification::class,
        'isBanned' => \HempEmpire\Http\Middleware\IsBanned::class,
        'notBanned' => \HempEmpire\Http\Middleware\NotBanned::class,
    ];
}

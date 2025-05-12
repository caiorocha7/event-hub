<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventGuestController;

/*------------------------------------------
| Rotas Públicas
|------------------------------------------*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

/*------------------------------------------
| Rotas Protegidas
|------------------------------------------*/
Route::middleware('auth:api')->group(function () {
    // Rotas de Autenticação
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Rotas de Eventos
    Route::apiResource('events', EventController::class)
        ->parameters(['events' => 'uuid'])
        ->except(['show']);

    Route::get('events/{uuid}', [EventController::class, 'show'])
        ->name('events.show');

    // Rotas de Inscrição
    Route::prefix('events/{uuid}')->group(function () {
        Route::post('/subscribe', [EventGuestController::class, 'subscribe']);
        Route::delete('/unsubscribe', [EventGuestController::class, 'unsubscribe']);
    });
    Route::get('/my-events', [EventGuestController::class, 'myEvents']);
});

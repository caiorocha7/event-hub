<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventGuestController;

// Rotas públicas de autenticação
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Rotas protegidas da API
Route::middleware('auth:api')->group(function () {
    // Eventos (CRUD via uuid)
    Route::apiResource('events', EventController::class)
        ->except(['show'])
        ->parameters(['events' => 'uuid']);

    Route::get('events/{uuid}', [EventController::class, 'show'])
        ->name('events.show');

    // Inscrições
    Route::post('events/{uuid}/subscribe', [EventGuestController::class, 'subscribe']);
    Route::delete('events/{uuid}/unsubscribe', [EventGuestController::class, 'unsubscribe']);
});

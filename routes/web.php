<?php

use Illuminate\Support\Facades\Route;

// Se você tiver rotas web específicas, coloque-as aqui antes do fallback.

// Fallback: qualquer rota não-API vai carregar a view do React
Route::view('/{any}', 'app')->where('any', '.*');

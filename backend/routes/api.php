<?php

use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\SubscribeController;
use App\Http\Controllers\Api\VerifyController;
use Illuminate\Support\Facades\Route;

Route::get('/content', [ContentController::class, 'index']);
Route::get('/supporters', [ContentController::class, 'supporters']);

// Public lists: published only, newest first (requirements 4.5)
Route::get('/{type}', [ContentController::class, 'listing'])->whereIn('type', ['news', 'events', 'projects', 'publications']);
Route::get('/{type}/{id}', [ContentController::class, 'show'])->whereIn('type', ['news', 'events', 'projects', 'publications']);

// Admin previews of unsaved changes (random token, expires after 30 minutes)
Route::get('/preview/{token}', fn (string $token) => response()->json(cache('preview:'.$token) ?? abort(404))->header('Cache-Control', 'no-store'))->where('token', '[A-Za-z0-9]{40}');

Route::post('/forms', [FormController::class, 'store'])->middleware('throttle:10,1');

Route::get('/verify', VerifyController::class)->middleware('throttle:30,1');
Route::get('/verify/{memberId}', VerifyController::class)->middleware('throttle:30,1');

Route::post('/subscribe', [SubscribeController::class, 'store'])->middleware('throttle:5,1');
Route::get('/subscribe/confirm/{token}', [SubscribeController::class, 'confirm'])->name('subscribe.confirm');
Route::get('/unsubscribe/{token}', [SubscribeController::class, 'unsubscribe'])->name('unsubscribe');

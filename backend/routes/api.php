<?php

use App\Http\Controllers\Api\RepoController;
use Illuminate\Support\Facades\Route;

Route::get('/repos/{username}', [RepoController::class, 'index']); 
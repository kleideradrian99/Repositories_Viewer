<?php

use App\Http\Controllers\Api\RepoController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ConfigurationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleMenusController;
use App\Http\Controllers\VehicleController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', function () {
    return view('dashboard');
})->middleware(['auth', 'verified', 'cekRole'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'cekRole'])->group(function () {

    Route::prefix('blog')->group(function () {
        foreach (['index', 'table'] as $key => $value) {
            Route::get($value == 'index' ? '/' : $value, [BlogController::class, $value])->name('blog.' . $value);
        }
        foreach (['store', 'show', 'destroy'] as $key => $value) {
            Route::post($value == 'store' ? '/' : $value, [BlogController::class, $value])->name('blog.' . $value);
        }
    });

    Route::prefix('role-menu')->group(function () {
        // Route::get('table', [RoleMenusController::class, 'table'])->name('role.table');
        // Route::get('/', [RoleMenusController::class, 'index']);
        foreach (['index', 'table'] as $key => $value) {
            Route::get($value == 'index' ? '/' : $value, [RoleMenusController::class, $value])->name('role.' . $value);
        }
        foreach (['store', 'show', 'destroy','saveRoleMenu','showRole'] as $key => $value) {
            Route::post($value == 'store' ? '/' : $value, [RoleMenusController::class, $value])->name('role.' . $value);
        }
    });

    Route::prefix('kendaraan')->group(function () {
        // Route::get('table', [RoleMenusController::class, 'table'])->name('role.table');
        // Route::get('/', [RoleMenusController::class, 'index']);
        foreach (['index', 'table','createPdf'] as $key => $value) {
            Route::get($value == 'index' ? '/' : $value, [VehicleController::class, $value])->name('kendaraan.' . $value);
        }
        foreach (['store', 'show', 'destroy'] as $key => $value) {
            Route::post($value == 'store' ? '/' : $value, [VehicleController::class, $value])->name('kendaraan.' . $value);
        }
    });

    Route::prefix('configuration')->group(function () {
        // Route::get('table', [RoleMenusController::class, 'table'])->name('role.table');
        // Route::get('/', [RoleMenusController::class, 'index']);
        foreach (['index', 'getConfig'] as $key => $value) {
            Route::get($value == 'index' ? '/' : $value, [ConfigurationController::class, $value])->name('configuration.' . $value);
        }
        foreach (['store', 'show', 'destroy'] as $key => $value) {
            Route::post($value == 'store' ? '/' : $value, [ConfigurationController::class, $value])->name('configuration.' . $value);
        }
    });
});

require __DIR__ . '/auth.php';

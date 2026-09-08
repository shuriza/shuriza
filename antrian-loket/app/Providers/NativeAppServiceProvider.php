<?php

namespace App\Providers;

use App\Services\OfficeInitializer;
use Native\Desktop\Contracts\ProvidesPhpIni;
use Native\Desktop\Facades\Window;

class NativeAppServiceProvider implements ProvidesPhpIni
{
    /**
     * Executed once the native application has been booted.
     * Use this method to open windows, register global shortcuts, etc.
     */
    public function boot(): void
    {
        app(OfficeInitializer::class)->initialize();

        Window::open()
            ->title('Antrian Loket — '.config('antrian.office.name', 'Kantor Pelayanan Publik'))
            ->width(1280)
            ->height(800)
            ->minWidth(1024)
            ->minHeight(700);
    }

    /**
     * Return an array of php.ini directives to be set.
     */
    public function phpIni(): array
    {
        return [
        ];
    }
}

<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

/**
 * Scans uploaded files with ClamAV when it is installed on the server.
 * Set VIRUS_SCAN_COMMAND in .env, e.g. "clamdscan --no-summary --fdpass" or "clamscan --no-summary".
 * Exit code 0 = clean, 1 = infected, anything else = scanner error.
 */
class VirusScanner
{
    public const CLEAN = 'clean';

    public const INFECTED = 'infected';

    public const ERROR = 'scan failed';

    public const SKIPPED = 'not scanned';

    public function scan(string $absolutePath): string
    {
        $command = trim((string) config('services.virus_scan.command'));
        if ($command === '') {
            return self::SKIPPED;
        }

        $result = Process::timeout(120)->run($command.' '.escapeshellarg($absolutePath));

        return match ($result->exitCode()) {
            0 => self::CLEAN,
            1 => self::INFECTED,
            default => tap(self::ERROR, fn () => Log::warning('Virus scan failed: '.$result->errorOutput().$result->output())),
        };
    }
}

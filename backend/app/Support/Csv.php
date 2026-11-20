<?php

namespace App\Support;

use Symfony\Component\HttpFoundation\StreamedResponse;

class Csv
{
    /** Streams rows (arrays keyed by column name) as a CSV download that opens correctly in Excel. */
    public static function download(string $filename, array $columns, iterable $rows): StreamedResponse
    {
        return response()->streamDownload(function () use ($columns, $rows) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF"); // UTF-8 BOM for Excel
            fputcsv($out, $columns);
            foreach ($rows as $row) {
                fputcsv($out, array_map(fn ($c) => self::safe($row[$c] ?? ''), $columns));
            }
            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    /** Prevents spreadsheet formula injection from website answers. */
    protected static function safe($v): string
    {
        $v = is_array($v) ? implode('; ', $v) : (string) $v;

        return preg_match('/^[=+\-@\t\r]/', $v) ? "'".$v : $v;
    }

    /** Reads a CSV file into arrays keyed by (normalised) header names. */
    public static function read(string $path): array
    {
        $h = fopen($path, 'r');
        $first = fgets($h);
        rewind($h);
        $delimiter = substr_count($first, ';') > substr_count($first, ',') ? ';' : ',';
        $header = null;
        $rows = [];
        while (($line = fgetcsv($h, 0, $delimiter)) !== false) {
            if ($header === null) {
                $header = array_map(fn ($c) => strtolower(trim(preg_replace('/[^a-z0-9]+/i', '_', str_replace("\xEF\xBB\xBF", '', $c)), '_')), $line);

                continue;
            }
            if (count(array_filter($line, fn ($c) => trim((string) $c) !== '')) === 0) {
                continue;
            }
            $rows[] = array_combine($header, array_pad(array_slice($line, 0, count($header)), count($header), ''));
        }
        fclose($h);

        return $rows;
    }
}

#!/bin/sh
# Local development server with upload limits large enough for the website forms
# (plain `php artisan serve` uses PHP's defaults of 2 MB per file / 8 MB per request).
cd "$(dirname "$0")/public" || exit 1
exec php -d upload_max_filesize=100M -d post_max_size=300M -d memory_limit=256M \
  -S "${HOST:-localhost}:${PORT:-8000}" ../vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php

#!/bin/bash
# Installed on the server as ~/.ihrc-usa-deploy/deploy.sh and run by cron every 5 minutes.
# Downloads the latest website build from the "site-build" branch (made by
# .github/workflows/build-site.yml) and copies it into the web root. Nothing is built here:
# the hosting account's file-count limit leaves no room for node_modules.
set -euo pipefail
export PATH=/usr/local/cpanel/3rdparty/lib/path-bin:/usr/local/bin:/usr/bin:/bin
repo=pradeepsingam/ihrc-usa-web
branch=site-build
deploy_dir="$HOME/.ihrc-usa-deploy"
web_root="$HOME/ihrc-usa.org"

exec 9>"$deploy_dir/deploy.lock"
flock -n 9 || exit 0

build=$(git ls-remote "https://github.com/$repo.git" "refs/heads/$branch" | cut -f1)
[[ -n $build ]] || exit 0
if [[ -f "$deploy_dir/deployed-build" && $(cat "$deploy_dir/deployed-build") == "$build" ]]; then
    exit 0
fi

work=$(mktemp -d "$deploy_dir/build.XXXXXX")
trap 'rm -rf "$work"' EXIT
curl -fsSL --retry 2 "https://codeload.github.com/$repo/tar.gz/$build" | tar xz -C "$work" --strip-components=1
test -s "$work/index.html"
test -s "$work/.htaccess"
test -s "$work/.source-revision"
test -d "$web_root"
revision=$(cat "$work/.source-revision")
rm "$work/.source-revision"
printf '%s Deploying build %s (source %s)\n' "$(date -Is)" "$build" "$revision"

rsync -rltp --chmod=D755,F644 --delay-updates "$work/" "$web_root/"
# Profile pages are all generated, so remove those of people no longer on the website.
if [[ -d "$work/member-profile" ]]; then
    rsync -rltp --chmod=D755,F644 --delete "$work/member-profile/" "$web_root/member-profile/"
fi
cmp "$work/index.html" "$web_root/index.html"

printf '%s\n' "$build" > "$deploy_dir/deployed-build"
printf '%s\n' "$revision" > "$deploy_dir/deployed"
printf '%s Deployed %s\n' "$(date -Is)" "$revision"

#!/bin/sh
set -eu

: "${VITE_ORCHESTRATION_URL:?VITE_ORCHESTRATION_URL을 설정해야 합니다}"
: "${VITE_CONSOLE_URL:?VITE_CONSOLE_URL을 설정해야 합니다}"

# JS 문자열을 깨뜨리는 따옴표, 역슬래시, 공백은 URL에서 허용하지 않는다.
for url in "$VITE_ORCHESTRATION_URL" "$VITE_CONSOLE_URL"; do
    case "$url" in
        *[[:space:]]*) echo 'URL에는 공백을 넣을 수 없습니다' >&2; exit 1 ;;
    esac
    if ! printf '%s\n' "$url" | LC_ALL=C grep -Eq '^https?://[A-Za-z0-9._~:/?#@!$&()*+,;=%-]+$'; then
        echo 'VITE_ORCHESTRATION_URL과 VITE_CONSOLE_URL에는 HTTP(S) URL을 설정해야 합니다' >&2
        exit 1
    fi
done

# sed replacement에서 &가 매치 전체로 해석되지 않도록 escape한다.
api_url=$(printf '%s' "$VITE_ORCHESTRATION_URL" | sed 's/[&|\\]/\\&/g')
console_url=$(printf '%s' "$VITE_CONSOLE_URL" | sed 's/[&|\\]/\\&/g')
find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.html' \) \
    -exec sed -i \
        -e "s|__ARTEL_ORCHESTRATION_URL__|${api_url}|g" \
        -e "s|__ARTEL_CONSOLE_URL__|${console_url}|g" \
        {} +

exec /docker-entrypoint.sh "$@"

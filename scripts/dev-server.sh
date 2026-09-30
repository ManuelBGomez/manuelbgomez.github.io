#!/bin/sh
# Runs inside the preview container (started by serve.sh / docker-compose.yml).
# Jekyll does not reload _config.yml by itself, so restart it whenever that file changes.
bundle install --quiet || exit 1

config_stamp() { stat -c %Y _config.yml; }
trap 'kill "$pid" 2>/dev/null; exit 0' INT TERM

while true; do
  bundle exec jekyll serve --host 0.0.0.0 --port 4000 --force_polling \
    --livereload --livereload-port "${LIVERELOAD_PORT:-35729}" &
  pid=$!
  last=$(config_stamp)
  while kill -0 "$pid" 2>/dev/null && [ "$(config_stamp)" = "$last" ]; do sleep 2; done
  kill -0 "$pid" 2>/dev/null || exit 1   # Jekyll crashed: stop so the error stays visible
  echo ">>> _config.yml changed, restarting Jekyll..."
  kill "$pid"; wait "$pid" 2>/dev/null
done

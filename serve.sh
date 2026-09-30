#!/usr/bin/env bash
# Preview the site at http://localhost:${PORT:-4000} (live reload on save).
# Usage:  bash serve.sh            (first run takes a few minutes to install gems)
#         PORT=4001 bash serve.sh  (if port 4000 is already taken)
set -euo pipefail
cd "$(dirname "$0")"
export HOST_UID="$(id -u)" HOST_GID="$(id -g)"
exec docker compose up "$@"

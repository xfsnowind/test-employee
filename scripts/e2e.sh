#!/usr/bin/env bash
set -euo pipefail

# Start vite dev server, wait for the app, run cypress, then clean up.
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

DEV_CMD="pnpm run dev"
TEST_CMD="pnpm run cypress:run"
URLS=("http://127.0.0.1:5173" "http://localhost:5173")
DETECTED_URL=""
MAX_WAIT=60

echo "Starting dev server: $DEV_CMD"
# Start dev server in background, redirect logs
${DEV_CMD} &
DEV_PID=$!
echo "Dev server PID: $DEV_PID "

echo "Waiting up to ${MAX_WAIT}s for one of ${URLS[*]} to respond..."
SECS=0
while [ -z "$DETECTED_URL" ]; do
  for url in "${URLS[@]}"; do
    if curl -sSf "$url" > /dev/null 2>&1; then
      DETECTED_URL="$url"
      break
    fi
  done
  sleep 1
  SECS=$((SECS+1))
  if [ $SECS -ge $MAX_WAIT ]; then
    echo "Timed out waiting for any URL after ${MAX_WAIT}s"
    echo "=== Dev server logs ==="
    tail -n +1 .e2e-dev.log || true
    kill $DEV_PID || true
    exit 1
  fi

done



echo "Detected server at ${DETECTED_URL} after ${SECS}s"
export CYPRESS_BASE_URL="$DETECTED_URL"
echo "Running tests against $CYPRESS_BASE_URL"
# Run Cypress tests (will use installed cypress)
${TEST_CMD}
EXIT_CODE=$?

echo "Tests finished with exit code ${EXIT_CODE}, shutting down dev server (PID ${DEV_PID})"
kill $DEV_PID || true
exit $EXIT_CODE

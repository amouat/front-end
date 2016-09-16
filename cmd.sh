#!/bin/bash
set -e

if [[ "$MODE" = "test" ]]; then
  echo "Running tests"
  npm start &
  #horrors
  sleep 5
  if [[ "$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8079)" != "200" ]]; then
    echo "Test failure"
    exit 1
  else
    echo "Tests passed"
  fi
else
  echo "Running prod"
  exec npm start
fi

#!/bin/bash
set -e

echo "[GitHub] Setting up git config..."
git config --global user.email "sentrix-bot@replit.com"
git config --global user.name "Sentrix Bot"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "[GitHub] ERROR: GITHUB_TOKEN not set"
  exit 1
fi

if [ -z "$GITHUB_REPO" ]; then
  echo "[GitHub] ERROR: GITHUB_REPO not set (format: owner/repo)"
  exit 1
fi

REMOTE_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git"

echo "[GitHub] Checking remote..."
if git remote get-url github 2>/dev/null; then
  git remote set-url github "$REMOTE_URL"
else
  git remote add github "$REMOTE_URL"
fi

echo "[GitHub] Pushing to https://github.com/${GITHUB_REPO}..."
git push github main --force 2>&1 | sed "s/${GITHUB_TOKEN}/***TOKEN***/g"

echo "[GitHub] Done! Push complete."

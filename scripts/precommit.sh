#!/usr/bin/env bash
set -e
echo "Validating rooms.json..."
node scripts/validateRooms.mjs
echo "Auditing images..."
node scripts/auditImages.mjs
echo "OK"

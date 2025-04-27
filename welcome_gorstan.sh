#!/bin/bash

clear

echo "======================================="
echo "        🌀 Welcome to Gorstan 🌀         "
echo "======================================="
echo
echo "Reality is bending. Choose wisely..."
echo

# Show current working directory
echo "📂 Current Directory:"
pwd
echo

# Small pause for dramatic effect
sleep 1

# Optionally start installation (comment out if you want manual install)
echo "🚀 Preparing to install Gorstan dependencies..."
sleep 1

# Auto-run install_gorstan.sh if you want:
if [ -f "./install_gorstan.sh" ]; then
  ./install_gorstan.sh
else
  echo "⚠️  install_gorstan.sh not found! Please run it manually."
fi

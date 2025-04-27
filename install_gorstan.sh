
echo "🚀 Installing Gorstan v2.0.0 core dependencies..."

# Initialize package.json if not already present
if [ ! -f package.json ]; then
  npm init -y
fi

# Install main React packages
npm install react react-dom

# Install Vite and Vite React plugin
npm install --save-dev vite @vitejs/plugin-react

# (Optional future) Install Howler.js if needed
# npm install howler

echo "✅ Installation complete!"
echo "👉 Now you can run: npm run dev"
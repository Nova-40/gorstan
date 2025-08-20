# Gorstan Deployment Guide

## 🚀 Manual Deployment (Recommended)

Since GitHub Actions requires additional Netlify API secrets, we use manual deployment:

### Quick Deploy
```bash
npm run deploy:manual
```

### Deploy with Version Bump
```bash
npm run deploy:force
```

### Verify Current Deployment
```bash
npm run verify:deployment
```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the application |
| `npm run deploy:manual` | Build and deploy to Netlify |
| `npm run deploy:force` | Bump version + deploy |
| `npm run verify:deployment` | Check if latest version is live |
| `npm run version:bump` | Increment build version |

## 🌐 Live Site

**Primary URL:** https://gorstan-game.netlify.app

## 📋 Deployment Checklist

1. ✅ Make your code changes
2. ✅ Test locally with `npm run dev`
3. ✅ Build with `npm run build`
4. ✅ Deploy with `npm run deploy:manual`
5. ✅ Verify with `npm run verify:deployment`
6. ✅ Check live site at https://gorstan-game.netlify.app

## 🔍 Version Tracking

The welcome screen shows version info in:
- Title: "Welcome to Gorstan (v##)"
- Bottom corners with build details
- Browser console logs

## 🆘 Troubleshooting

**If deployment seems stuck:**
1. Wait 2-3 minutes for propagation
2. Check asset hash: `curl -s "https://gorstan-game.netlify.app" | grep "index-"`
3. Force fresh deployment: `npm run deploy:force`

**If version doesn't update:**
1. Hard refresh browser (Ctrl+F5)
2. Check browser console for version logs
3. Verify asset hash changed

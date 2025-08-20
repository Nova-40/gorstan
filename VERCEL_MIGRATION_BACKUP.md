# Vercel to Netlify Migration - Backup of vercel.json

This file contains the original Vercel configuration that was migrated to netlify.toml:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": null,
  "alias": ["gorstan-game.vercel.app"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://api.groq.com; frame-ancestors 'self' https://www.thegorstanchronicles.com https://thegorstanchronicles.com;"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "/index.html",
      "permanent": false
    }
  ]
}
```

This configuration has been successfully migrated to netlify.toml with equivalent Netlify syntax.

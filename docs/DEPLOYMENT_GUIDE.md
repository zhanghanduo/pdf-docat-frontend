# PDF-Docat Frontend Deployment Guide

Complete guide for deploying the PDF-Docat frontend to various platforms.

## 🏗️ Prerequisites

- ✅ Backend API deployed and accessible
- ✅ Node.js 18+ installed locally
- ✅ GitHub account for repository hosting

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Best for**: Zero-config deployment with excellent performance

#### Step 1: Prepare Repository
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/zhanghanduo/pdf-docat-frontend.git
git push -u origin main
```

#### Step 2: Deploy on Vercel
1. Visit [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" → Import your repository
3. Configure settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Step 3: Set Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```
VITE_API_BASE_URL=https://your-backend-api.example.com
```

#### Step 4: Deploy
- Click "Deploy"
- Your app will be available at `https://your-project.vercel.app`

### Option 2: Netlify

**Best for**: Static site hosting with additional features

#### Method A: Drag & Drop Deployment
```bash
# Build locally
npm install
npm run build

# Deploy to Netlify
# 1. Visit netlify.com
# 2. Drag the 'dist/' folder to Netlify
# 3. Set environment variables in Site Settings
```

#### Method B: GitHub Integration
1. Push code to GitHub (same as Vercel Step 1)
2. Connect repository to Netlify
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: `VITE_API_BASE_URL=https://your-backend-api.example.com`

### Option 3: Replit

**Best for**: Quick deployment and development environment

#### Step 1: Create Replit Project
1. Visit [replit.com](https://replit.com) and sign in
2. Click "Create Repl"
3. Choose "Import from GitHub"
4. Enter repository URL: `https://github.com/zhanghanduo/pdf-docat-frontend`

#### Step 2: Configure Environment
1. In Replit, go to "Secrets" tab (lock icon)
2. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-api.example.com
   ```

#### Step 3: Configure Replit Files
Create `.replit` file in root:
```toml
modules = ["nodejs-18"]

[nix]
channel = "stable-22_11"

[deployment]
run = ["sh", "-c", "npm run build && npm run preview -- --host 0.0.0.0 --port 3000"]
deploymentTarget = "cloudrun"

[[ports]]
localPort = 3000
externalPort = 80
```

Create `replit.nix` file:
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
  ];
}
```

#### Step 4: Deploy
1. Click "Run" button in Replit
2. Replit will automatically install dependencies and build
3. Your app will be available at `https://your-project.username.replit.app`

### Option 4: GitHub Pages

**Best for**: Free hosting for public repositories

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add deploy script to package.json
# "scripts": {
#   "deploy": "gh-pages -d dist"
# }

# Build and deploy
npm run build
npm run deploy
```

Configure in repository settings:
- Enable GitHub Pages
- Set source to `gh-pages` branch

### Option 5: Cloudflare Pages

**Best for**: Fast global CDN with edge computing

1. Connect GitHub repository to Cloudflare Pages
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Environment variables**: `VITE_API_BASE_URL=https://your-backend-api.example.com`

## 🔧 Environment Configuration

### Required Environment Variables

For all platforms, you must set:
```env
VITE_API_BASE_URL=https://your-backend-api.example.com
```

Replace `https://your-backend-api.example.com` with your actual backend API URL.

### Local Development Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file and set your backend URL
# VITE_API_BASE_URL=https://your-backend-api.example.com

# For local backend development:
# VITE_API_BASE_URL=http://localhost:8000
```

## 🧪 Testing Your Deployment

### 1. Test Backend Connection

Before deploying, verify your backend is accessible:

```bash
# Test with your actual backend URL
API_BASE_URL=https://your-backend-api.example.com node test-connection.js
```

### 2. Test Frontend Locally

```bash
npm install
npm run dev
# Visit http://localhost:5173
```

### 3. Test Production Build

```bash
npm run build
npm run preview
# Visit http://localhost:4173
```

### 4. Verify Deployment

After deployment, check:
- [ ] Frontend loads without errors
- [ ] Service status shows "Available"
- [ ] Language dropdown populates
- [ ] File upload works
- [ ] PDF translation completes
- [ ] Download functionality works
- [ ] Mobile responsiveness

## 🔒 CORS Configuration

Ensure your backend API allows requests from your frontend domain:

```javascript
// Backend CORS configuration should include:
const allowedOrigins = [
  'http://localhost:*',           // Local development
  'https://*.vercel.app',         // Vercel deployments
  'https://*.netlify.app',        // Netlify deployments
  'https://*.replit.app',         // Replit deployments
  'https://*.pages.dev',          // Cloudflare Pages
  'https://*.github.io',          // GitHub Pages
  'https://yourdomain.com'        // Custom domain
];
```

## 🚨 Troubleshooting

### Common Issues

#### 1. API Connection Failed
```bash
# Check backend status
curl https://your-backend-api.example.com/health

# Should return: {"status": "healthy"} or similar
```

**Solutions:**
- Verify `VITE_API_BASE_URL` is correctly set
- Check if backend is running and accessible
- Ensure CORS is properly configured

#### 2. Environment Variables Not Working
- Ensure variables start with `VITE_`
- Restart development server after changes
- Check deployment platform's environment variable settings
- Variables are build-time, not runtime

#### 3. Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+

# Run type checking
npm run type-check
```

#### 4. CORS Errors
- Check browser console for specific CORS errors
- Verify backend CORS configuration includes your domain
- Ensure HTTPS is used in production

#### 5. Replit-Specific Issues
- Check if `.replit` and `replit.nix` files are properly configured
- Verify environment variables are set in Secrets tab
- Ensure port configuration matches your setup

### Debug Tools

1. **Connection Test**: 
   ```bash
   API_BASE_URL=https://your-api.com node test-connection.js
   ```

2. **Browser DevTools**:
   - Network tab for API requests
   - Console for JavaScript errors
   - Application tab for environment variables

3. **Build Analysis**:
   ```bash
   npm run build
   npx vite-bundle-analyzer dist
   ```

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build -- --mode production
npx vite-bundle-analyzer dist
```

### Deployment Best Practices
- Enable gzip compression
- Set proper cache headers
- Use CDN for static assets
- Monitor Core Web Vitals
- Enable HTTPS

## 💰 Cost Comparison

| Platform | Free Tier | Bandwidth | Build Time | Custom Domain |
|----------|-----------|-----------|------------|---------------|
| **Vercel** | 100GB/month | Unlimited | 6000 min/month | ✅ Free |
| **Netlify** | 100GB/month | 100GB/month | 300 min/month | ✅ Free |
| **Replit** | Limited usage | Limited | Unlimited | ✅ Free |
| **GitHub Pages** | 1GB storage | 100GB/month | N/A | ✅ Free |
| **Cloudflare Pages** | Unlimited | Unlimited | 500 builds/month | ✅ Free |

## 🔄 Continuous Deployment

### Automatic Deployment Setup

Most platforms support automatic deployment:

1. **Vercel**: Auto-deploys on push to main branch
2. **Netlify**: Configurable branch deployment
3. **Replit**: Manual deployment via dashboard
4. **Cloudflare Pages**: Git integration with preview deployments

### Preview Deployments

- **Vercel**: Automatic preview URLs for pull requests
- **Netlify**: Deploy previews for branches
- **Cloudflare Pages**: Preview deployments for all branches

## 🛡️ Security Best Practices

### Environment Variables
- Never commit `.env` files to git
- Use platform-specific environment variable settings
- Rotate API keys regularly
- Use different keys for development/production

### HTTPS and Security Headers
```html
<!-- Add to index.html for enhanced security -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               connect-src 'self' https://your-backend-api.example.com;">
```

## 🌐 Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS settings

### Replit
1. Go to your Repl settings
2. Add custom domain (Replit Pro required)
3. Configure DNS CNAME record

## 📈 Monitoring and Analytics

### Recommended Tools
1. **Vercel Analytics** - Built-in performance monitoring
2. **Google Analytics** - User behavior tracking
3. **Sentry** - Error monitoring
4. **Uptime Robot** - Service availability monitoring

### Health Monitoring
Set up monitoring for:
- Frontend availability
- Backend API health
- Page load times
- Error rates
- Core Web Vitals

## 🎉 Success Checklist

After deployment, verify:

- [ ] Frontend loads without errors
- [ ] API connection status shows "Available"
- [ ] All supported languages are listed
- [ ] File upload accepts PDF files
- [ ] Translation process completes successfully
- [ ] Download functionality works
- [ ] Responsive design on mobile devices
- [ ] HTTPS is enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics/monitoring set up (optional)

## 🤝 Support and Next Steps

### If You Encounter Issues:

1. Check this troubleshooting guide
2. Test backend connectivity: `API_BASE_URL=https://your-api.com node test-connection.js`
3. Review browser console for errors
4. Verify environment variables are correctly set
5. Check deployment platform logs

### Scaling Considerations:

- **Traffic Growth**: Consider upgrading to paid tiers
- **Performance**: Implement CDN and caching strategies
- **Monitoring**: Set up comprehensive monitoring and alerting
- **Security**: Regular security audits and updates

Your PDF-Docat frontend is now ready for production deployment! 🚀

Choose the deployment option that best fits your needs and follow the step-by-step instructions above. 
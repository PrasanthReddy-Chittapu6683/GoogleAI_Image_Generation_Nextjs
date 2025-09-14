# 🚀 Deployment Guide for Next.js Image Generation App

## 📋 Prerequisites

- ✅ GitHub repository: `PrasanthReddy-Chittapu6683/GoogleAI_Image_Generation_Nextjs`
- ✅ Google AI API key
- ✅ Next.js application working locally

## 🎯 Deployment Options

### **Option 1: Vercel (Recommended)**

**Why Vercel?**
- Made by the creators of Next.js
- Zero-config deployment
- Automatic HTTPS and CDN
- Serverless functions support
- Free tier available

**Steps:**
1. **Visit [vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import Repository**: `PrasanthReddy-Chittapu6683/GoogleAI_Image_Generation_Nextjs`
5. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add: `GOOGLE_GENERATIVE_AI_API_KEY` = `your_actual_api_key`
6. **Click "Deploy"**
7. **Your app will be live at**: `https://your-app-name.vercel.app`

**Automatic Deployments:**
- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests

---

### **Option 2: Netlify**

**Steps:**
1. **Visit [netlify.com](https://netlify.com)**
2. **Sign in with GitHub**
3. **Click "New site from Git"**
4. **Select Repository**: `PrasanthReddy-Chittapu6683/GoogleAI_Image_Generation_Nextjs`
5. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. **Environment Variables**:
   - Go to Site settings → Environment variables
   - Add: `GOOGLE_GENERATIVE_AI_API_KEY` = `your_actual_api_key`
7. **Deploy**

---

### **Option 3: Railway**

**Steps:**
1. **Visit [railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Deploy from GitHub repo**
5. **Select your repository**
6. **Add Environment Variable**: `GOOGLE_GENERATIVE_AI_API_KEY`
7. **Deploy**

---

### **Option 4: GitHub Pages (Static Export)**

**Note**: This option requires converting to static export (API routes won't work)

**Steps:**
1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`

2. **Create GitHub Actions Workflow**:
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
         - run: npm run export
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

3. **Update next.config.js** for static export:
   ```javascript
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     // ... rest of config
   }
   ```

---

## 🔧 Environment Variables Setup

**Required Environment Variable:**
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_google_ai_api_key_here
```

**How to get your API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with Google account
3. Click "Get API key"
4. Copy the generated key

---

## 🎉 Post-Deployment

**After successful deployment:**
1. **Test your app** on the live URL
2. **Verify image generation** works
3. **Check all pages** load correctly
4. **Test on mobile devices**

**Custom Domain (Optional):**
- Most platforms support custom domains
- Add your domain in platform settings
- Update DNS records as instructed

---

## 📊 Monitoring & Analytics

**Vercel Analytics:**
- Built-in performance monitoring
- Real user metrics
- Core Web Vitals tracking

**Other Options:**
- Google Analytics
- Plausible Analytics
- Hotjar for user behavior

---

## 🔄 Continuous Deployment

**Automatic Deployments:**
- Push to `main` branch → Production deployment
- Pull requests → Preview deployments
- Rollback capabilities available

**Manual Deployments:**
- Trigger from platform dashboard
- Deploy specific commits
- Environment-specific deployments

---

## 🆘 Troubleshooting

**Common Issues:**
1. **API Key Error**: Check environment variables are set correctly
2. **Build Failures**: Check Node.js version compatibility
3. **Image Generation Fails**: Verify Google AI API key and quotas
4. **Styling Issues**: Check Tailwind CSS build process

**Support:**
- Platform documentation
- GitHub Issues
- Community forums

---

## 🎯 Recommended Deployment

**For Production**: Use **Vercel** - Best Next.js experience
**For Learning**: Try **Netlify** - Great free tier
**For Enterprise**: Consider **Railway** or **AWS**

Your app is ready to deploy! Choose the platform that best fits your needs.

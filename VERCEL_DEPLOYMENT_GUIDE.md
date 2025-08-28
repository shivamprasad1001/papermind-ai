# Render.com Deployment Guide for PaperMind AI Backend

### Step 1: Prepare Your Repository
1. Ensure all changes are committed and pushed to GitHub
2. Verify your `render.yaml` file is in the `backend/` directory
3. Make sure your environment variables are ready

### Step 2: Deploy on Render.com
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `papermindAI-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `pnpm dev`

### Step 3: Set Environment Variables
Add these environment variables in Render.com dashboard:

```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
MAX_FILE_SIZE=52428800
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Add Secret Files
Add these as secret files:
- `PINECONE_API_KEY`: Your Pinecone API key
- `PINECONE_INDEX`: Your Pinecone index name
- `GEMINI_API_KEY`: Your Google Gemini API key

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your backend will be available at: `https://your-service-name.onrender.com`

## 🔧 Build Process Fixes Applied

### 1. Removed rimraf Dependency
- **Problem**: `rimraf` not available in deployment environments
- **Solution**: Used Node.js built-in `fs.rmSync()` for cross-platform compatibility

### 2. Fixed Build Script
```json
{
  "scripts": {
    "build": "node -e \"if (require('fs').existsSync('dist')) require('fs').rmSync('dist', { recursive: true, force: true })\" && tsc",
    "start": "node dist/server.js"
  }
}
```

### 3. Fixed TypeScript Type Definitions
- **Problem**: Type definitions in `devDependencies` not available during production builds
- **Solution**: Moved all essential type definitions to `dependencies`:
  - `@types/express`
  - `@types/node`
  - `@types/cors`
  - `@types/compression`
  - `@types/multer`
- **Result**: TypeScript compilation now works in production environments

### 4. Fixed Express.Multer Type Issues
- **Problem**: `Express.Multer.File` type not available in production builds
- **Solution**: Created custom `MulterFile` interface in both:
  - `src/controllers/chatController.ts`
  - `src/types/express-overrides.d.ts`
- **Result**: All multer-related type errors resolved

### 4. Updated TypeScript Configuration
- Proper output directory structure
- Cross-platform compatibility
- Production-ready compilation settings

## 🧪 Testing Your Deployment

### Health Check
```bash
curl https://your-service-name.onrender.com/health
```

### Ready Check
```bash
curl https://your-service-name.onrender.com/ready
```

### API Test
```bash
curl https://your-service-name.onrender.com/api/test
```

## 🔍 Troubleshooting

### Build Failures
1. Check Render.com build logs
2. Verify all dependencies are in `package.json`
3. Ensure TypeScript compilation succeeds locally

### TypeScript Type Definition Errors
**Error**: `Cannot find type definition file for 'express'` or `Cannot find type definition file for 'node'`
**Solution**: 
- Ensure `@types/express` and `@types/node` are in `dependencies` (not `devDependencies`)
- Check that `tsconfig.json` doesn't have explicit `types` array that conflicts with dependencies

**Error**: `Cannot find a declaration file for module 'cors'`, `'compression'`, or `'multer'`
**Solution**:
- Move all `@types/*` packages to `dependencies` in `package.json`
- Ensure these are available during production builds

**Error**: `Namespace 'Express' has no exported member 'Multer'`
**Solution**:
- Create custom `MulterFile` interface instead of using `Express.Multer.File`
- Update type definitions in controller and express-overrides files

### Runtime Errors
1. Check environment variables are set correctly
2. Verify API keys are valid
3. Check Render.com logs for detailed error messages

### CORS Issues
1. Update `FRONTEND_URL` environment variable
2. Ensure frontend domain is correctly configured
3. Check CORS settings in `app.ts`

## 📊 Monitoring

### Render.com Dashboard
- Monitor application logs
- Check resource usage
- View deployment history

### Health Endpoints
- `/health`: Basic health check
- `/ready`: Application readiness
- `/api/test`: API functionality test

## 🎯 Success Criteria

Your deployment is successful when:
1. ✅ Build completes without errors
2. ✅ Health endpoint returns `{"status":"ok"}`
3. ✅ Ready endpoint returns `{"status":"ready"}`
4. ✅ API test endpoint returns success
5. ✅ Frontend can connect to backend
6. ✅ File uploads work correctly
7. ✅ Chat functionality works properly

## 📞 Support

If you encounter issues:
1. Check Render.com documentation
2. Review application logs
3. Verify environment variables
4. Test endpoints individually
5. Ensure all dependencies are properly installed

---

**Remember**: Vercel is excellent for frontend applications but not suitable for this type of backend application. Use Render.com, Railway.app, or DigitalOcean for the best results.

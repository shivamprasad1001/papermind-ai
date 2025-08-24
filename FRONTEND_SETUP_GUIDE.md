# Frontend Setup Guide for Deployed Backend

## 🎉 Backend Successfully Deployed!

Your backend is now live at: `https://your-service-name.onrender.com`

## 🔧 Frontend Configuration

### Step 1: Update Environment Variables

Update your frontend's environment variables to point to the deployed backend:

**For Vercel deployment:**
1. Go to your Vercel dashboard
2. Navigate to your frontend project
3. Go to Settings → Environment Variables
4. Add/Update:
   ```
   VITE_API_BASE_URL=https://your-service-name.onrender.com
   ```

**For local development:**
Update `frontend/.env`:
```env
VITE_API_BASE_URL=https://your-service-name.onrender.com
```

### Step 2: Test the Connection

After updating the environment variables, test that your frontend can connect to the backend:

1. **Health Check**: Visit `https://your-service-name.onrender.com/health`
2. **Ready Check**: Visit `https://your-service-name.onrender.com/ready`
3. **API Test**: Visit `https://your-service-name.onrender.com/api/test`

### Step 3: Deploy Frontend Updates

If you're using Vercel:
1. The updated `pnpm-lock.yaml` has been pushed
2. Vercel should automatically redeploy
3. Check the build logs to ensure success

## 🧪 Testing Your Full Application

### 1. File Upload Test
- Upload a PDF file through the frontend
- Verify it processes successfully
- Check that the file appears in your document list

### 2. Chat Functionality Test
- Select a processed document
- Ask questions about the document
- Verify AI responses are generated

### 3. Error Handling Test
- Try uploading non-PDF files
- Test with very large files
- Verify proper error messages

## 🔍 Troubleshooting

### Frontend Can't Connect to Backend
1. **Check CORS**: Ensure your backend's `FRONTEND_URL` environment variable is set correctly
2. **Verify URL**: Double-check the `VITE_API_BASE_URL` is correct
3. **Check Network**: Use browser dev tools to see network requests

### Build Errors
1. **Lock File**: The `pnpm-lock.yaml` has been updated and pushed
2. **Dependencies**: All dependencies should be properly resolved
3. **Environment**: Ensure all environment variables are set

### API Errors
1. **Check Backend Logs**: Monitor Render.com dashboard for backend errors
2. **Verify API Keys**: Ensure Pinecone and Gemini API keys are set
3. **Test Endpoints**: Use the health and test endpoints to verify backend status

## 📊 Monitoring

### Backend Monitoring (Render.com)
- Check application logs
- Monitor resource usage
- View deployment history

### Frontend Monitoring (Vercel)
- Check build logs
- Monitor performance
- View analytics

## 🎯 Success Criteria

Your full application is working when:
1. ✅ Frontend builds and deploys successfully on Vercel
2. ✅ Frontend can connect to backend
3. ✅ File uploads work correctly
4. ✅ Chat functionality works properly
5. ✅ Error handling works as expected

## 🚀 Next Steps

1. **Update your backend URL** in the frontend environment variables
2. **Redeploy your frontend** (should happen automatically on Vercel)
3. **Test the full application** end-to-end
4. **Monitor both services** for any issues

---

**Your PaperMind AI application is now fully deployed and ready to use!** 🎉

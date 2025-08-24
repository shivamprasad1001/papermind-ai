# 🚀 Frontend Setup Guide - Fix "Network Error"

## 📁 **Project Structure**
```
papermind-ai-v2/
├── backend/          # Backend server (Port 3001)
├── frontend/         # Frontend app (Port 5173)
├── .env              # Backend environment variables
└── package.json      # Root package.json
```

## ❌ **Problem: "Network Error" when uploading PDFs**

## 🔍 **Root Causes:**
1. **Missing Frontend Environment File** - No `.env` file in frontend folder
2. **CORS Configuration** - Backend not allowing frontend requests
3. **File Size Limits** - Mismatch between frontend and backend
4. **Port Configuration** - Frontend and backend running on different ports

## ✅ **Solutions Applied (Backend Fixed):**
- ✅ CORS configuration updated to allow localhost origins
- ✅ File size limits increased from 10MB to 50MB
- ✅ Better error handling and logging
- ✅ Multer configuration updated

## 🛠️ **Manual Steps Required:**

### **Step 1: Create Frontend Environment File**

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Create `.env` file:**
   ```bash
   # Windows PowerShell:
   New-Item -Path ".env" -ItemType File
   
   # Or manually create a file named ".env" (with the dot)
   ```

3. **Add this content to `.env`:**
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```

### **Step 2: Verify Backend is Running**
```bash
cd backend
pnpm run dev
```

**Expected Output:**
```
🚀 Server running on port 3001
📊 Environment: development
🔗 Health check: http://localhost:3001/health
✅ Ready check: http://localhost:3001/ready
```

### **Step 3: Test Backend Endpoints**
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test upload endpoint
curl -X POST http://localhost:3001/api/upload \
  -F "file=@test.pdf" \
  -H "Content-Type: multipart/form-data"
```

### **Step 4: Start Frontend**
```bash
cd frontend
pnpm run dev
```

**Expected Output:**
```
VITE v5.4.19 ready in 964 ms
➜  Local:   http://localhost:5173/
```

## 🔧 **Current Configuration:**

### **Backend (Port 3001)**
- ✅ CORS: Allows all localhost origins in development
- ✅ File Size: 50MB maximum
- ✅ Health: `/health` endpoint working
- ✅ Upload: `/api/upload` endpoint working
- ✅ Chat: `/api/chat` endpoint working

### **Frontend (Port 5173)**
- ✅ Port: 5173 (configured in vite.config.ts)
- ✅ API Base: `http://localhost:3001` (after creating .env)
- ✅ File Size: 50MB maximum
- ✅ Dependencies: All required packages installed

## 🧪 **Testing Steps:**

### **1. Test CORS with Browser**
Open `backend/test-cors.html` in your browser:
- Click "Test Health Endpoint"
- Click "Test Upload Endpoint"
- Check for any CORS errors

### **2. Test Frontend Integration**
1. Open `http://localhost:5173` in browser
2. Try uploading a PDF file
3. Check browser console for errors
4. Check Network tab in DevTools

### **3. Debug Common Issues**
- **CORS Error**: Check if backend CORS is configured correctly
- **File Too Large**: Ensure backend file size limits are updated
- **Network Error**: Verify backend is running and accessible

## 🚨 **Troubleshooting:**

### **Issue: "Network Error"**
**Possible Causes:**
- Backend not running
- Wrong port number
- CORS blocking
- Firewall/antivirus blocking

**Solutions:**
1. Check if backend is running: `curl http://localhost:3001/health`
2. Verify ports: Backend 3001, Frontend 5173
3. Check CORS configuration
4. Disable firewall/antivirus temporarily

### **Issue: "CORS Error"**
**Solutions:**
1. Ensure backend CORS allows localhost origins
2. Check if frontend origin is in allowed list
3. Restart backend after CORS changes

### **Issue: "File Too Large"**
**Solutions:**
1. Verify backend file size limits are 50MB
2. Check multer configuration
3. Restart backend after config changes

## 📋 **Complete Checklist:**

- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Frontend `.env` file created with `VITE_API_BASE_URL=http://localhost:3001`
- [ ] CORS configuration updated in backend
- [ ] File size limits increased to 50MB
- [ ] Backend restarted after changes
- [ ] Test endpoints working
- [ ] Frontend upload working without "Network Error"

## 🎯 **Expected Result:**
After following these steps, your frontend should be able to:
- ✅ Upload PDFs up to 50MB
- ✅ Communicate with backend without CORS errors
- ✅ Handle file uploads without "Network Error" messages
- ✅ Process PDFs and chat with documents

## 🔄 **If Still Having Issues:**
1. Check browser console for specific error messages
2. Verify backend is running and accessible
3. Test with `backend/test-cors.html` file
4. Check network tab in browser dev tools
5. Ensure no firewall/antivirus blocking requests
6. Check if both frontend and backend are using the same network interface

## 📞 **Need Help?**
If you're still getting errors after following this guide:
1. Share the specific error message from browser console
2. Share the network tab details from DevTools
3. Confirm both services are running on correct ports
4. Test with the CORS test file first

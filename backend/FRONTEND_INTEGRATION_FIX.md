# 🚀 Frontend Integration Fix Guide

## ❌ **Problem: "Network Error" when uploading PDFs from Frontend**

## 🔍 **Root Causes Identified:**

1. **Missing Frontend Environment File** - No `.env` file in frontend
2. **CORS Configuration** - Backend not allowing frontend requests properly
3. **File Size Limits** - Backend limited to 10MB, frontend expecting 50MB
4. **Port Configuration** - Frontend and backend port mismatch

## ✅ **Solutions Applied:**

### 1. **Fixed CORS Configuration**
- Updated backend to allow all localhost origins in development
- Added better CORS logging for debugging
- Increased allowed headers and exposed headers

### 2. **Increased File Size Limits**
- Backend: 10MB → 50MB
- Frontend: 10MB → 50MB
- Multer configuration updated
- Express body parsing limits increased

### 3. **Environment Configuration**
- Backend now properly loads `.env` file
- File size limits configurable via environment variables

## 🛠️ **Manual Steps Required:**

### **Step 1: Create Frontend Environment File**
Create `frontend/.env` file with:
```env
VITE_API_BASE_URL=http://localhost:3001
```

### **Step 2: Verify Ports**
- Backend: Port 3001 ✅
- Frontend: Port 5173 or 5174 ✅

### **Step 3: Test CORS**
Open `backend/test-cors.html` in browser to test endpoints

## 🔧 **Current Configuration:**

### **Backend (Port 3001)**
- CORS: Allows all localhost origins in development
- File Size: 50MB maximum
- Health: `/health` ✅
- Upload: `/api/upload` ✅
- Chat: `/api/chat` ✅

### **Frontend (Port 5173/5174)**
- API Base: `http://localhost:3001`
- File Size: 50MB maximum
- Environment: Development mode

## 🧪 **Testing Steps:**

1. **Test Health Endpoint:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Test Upload Endpoint:**
   ```bash
   curl -X POST http://localhost:3001/api/upload \
     -F "file=@test.pdf" \
     -H "Content-Type: multipart/form-data"
   ```

3. **Test Frontend Integration:**
   - Open `backend/test-cors.html` in browser
   - Click "Test Upload Endpoint"
   - Check browser console for errors

## 🚨 **Common Issues & Solutions:**

### **Issue: "Network Error"**
- **Cause:** CORS blocking, wrong URL, port mismatch
- **Solution:** Check CORS config, verify ports, check network

### **Issue: "File Too Large"**
- **Cause:** File size limits not updated
- **Solution:** Restart backend after config changes

### **Issue: "CORS Error"**
- **Cause:** Frontend origin not allowed
- **Solution:** Check CORS configuration, verify frontend URL

## 📋 **Checklist:**

- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173/5174
- [ ] Frontend `.env` file created
- [ ] CORS configuration updated
- [ ] File size limits increased
- [ ] Backend restarted after changes
- [ ] Test endpoints working
- [ ] Frontend upload working

## 🎯 **Expected Result:**
Frontend should now be able to upload PDFs without "Network Error" messages.

## 🔄 **If Still Having Issues:**
1. Check browser console for specific error messages
2. Verify backend is running and accessible
3. Test with `test-cors.html` file
4. Check network tab in browser dev tools
5. Ensure no firewall/antivirus blocking requests

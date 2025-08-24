const http = require('http');

const BASE_URL = 'http://localhost:3001';

// Test health endpoint
function testHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Health endpoint: OK');
          resolve();
        } else {
          console.log('❌ Health endpoint: Failed');
          reject(new Error(`Status: ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
  });
}

// Test ready endpoint
function testReady() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/ready`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Ready endpoint: OK');
          resolve();
        } else {
          console.log('❌ Ready endpoint: Failed');
          reject(new Error(`Status: ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
  });
}

// Test API test endpoint
function testApiTest() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/api/test`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ API test endpoint: OK');
          resolve();
        } else {
          console.log('❌ API test endpoint: Failed');
          reject(new Error(`Status: ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
  });
}

// Test 404 endpoint
function test404() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/nonexistent`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 404) {
          console.log('✅ 404 handler: OK');
          resolve();
        } else {
          console.log('❌ 404 handler: Failed');
          reject(new Error(`Status: ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
  });
}

// Run all tests
async function runTests() {
  console.log('🚀 Testing PaperMind AI Backend Endpoints...\n');
  
  try {
    await testHealth();
    await testReady();
    await testApiTest();
    await test404();
    
    console.log('\n🎉 All tests passed! Your backend is working correctly.');
    console.log('\n📋 Available endpoints:');
    console.log('   GET  /health      - Health check');
    console.log('   GET  /ready       - Readiness check');
    console.log('   GET  /api/test    - API test');
    console.log('   POST /api/upload  - PDF upload (requires file)');
    console.log('   POST /api/chat    - Chat with document (requires message & documentId)');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();

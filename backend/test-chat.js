const http = require('http');

const testChat = () => {
  const postData = JSON.stringify({
    message: "What is this document about?",
    documentId: "doc-1756030401681-bwy4gx6",
    userType: "general"
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response Body:');
      try {
        const jsonResponse = JSON.parse(data);
        console.log(JSON.stringify(jsonResponse, null, 2));
      } catch (e) {
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
  });

  req.write(postData);
  req.end();
};

console.log('Testing chat endpoint...');
testChat();

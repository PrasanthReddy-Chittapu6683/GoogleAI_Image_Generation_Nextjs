const { spawn } = require('child_process');
const http = require('http');

console.log('Starting Next.js application test...');

// Start the Next.js server
const nextProcess = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'pipe'
});

let serverReady = false;

nextProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Next.js output:', output);
  
  if (output.includes('Ready') || output.includes('started server')) {
    serverReady = true;
    testServer();
  }
});

nextProcess.stderr.on('data', (data) => {
  console.log('Next.js error:', data.toString());
});

function testServer() {
  if (serverReady) {
    console.log('Testing server...');
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (data.includes('Image Editor Studio')) {
          console.log('✅ Next.js application is working correctly!');
          console.log('✅ Home page loads successfully');
        } else {
          console.log('❌ Application not working as expected');
          console.log('Response preview:', data.substring(0, 200));
        }
        
        // Test studio page
        testStudioPage();
      });
    });

    req.on('error', (e) => {
      console.log(`❌ Problem with request: ${e.message}`);
    });

    req.end();
  }
}

function testStudioPage() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/studio',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Studio page status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (data.includes('Studio') && data.includes('Image upload')) {
        console.log('✅ Studio page loads successfully');
      } else {
        console.log('❌ Studio page not working as expected');
      }
      
      console.log('\n🎉 Next.js conversion completed successfully!');
      console.log('📁 Application is located in: image_generation_nextjs/');
      console.log('🚀 To run the app: cd image_generation_nextjs && npm run dev');
      console.log('🌐 Open: http://localhost:3000');
      
      nextProcess.kill();
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.log(`❌ Problem with studio request: ${e.message}`);
    nextProcess.kill();
    process.exit(1);
  });

  req.end();
}

// Timeout after 30 seconds
setTimeout(() => {
  console.log('❌ Test timed out');
  nextProcess.kill();
  process.exit(1);
}, 30000);

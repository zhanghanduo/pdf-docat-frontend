// Simple test script to verify frontend-backend connection
// Run with: node test-connection.js
// Or with custom URL: API_BASE_URL=https://your-api.com node test-connection.js

const API_BASE_URL = process.env.API_BASE_URL || 'https://your-backend-api.example.com';

async function testConnection() {
  console.log('🔍 Testing PDF-Docat API Connection...');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  
  if (API_BASE_URL === 'https://your-backend-api.example.com') {
    console.log('⚠️  Using example URL. Set API_BASE_URL environment variable to test your actual backend.');
    console.log('   Example: API_BASE_URL=https://your-api.com node test-connection.js');
    return;
  }
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData);
    
    // Test supported languages endpoint
    console.log('\n2. Testing supported languages endpoint...');
    const languagesResponse = await fetch(`${API_BASE_URL}/api/v1/supported-languages`);
    
    if (!languagesResponse.ok) {
      throw new Error(`Languages check failed: ${languagesResponse.status}`);
    }
    
    const languagesData = await languagesResponse.json();
    console.log('✅ Languages endpoint passed');
    console.log('📋 Available languages:', Object.keys(languagesData.languages).length);
    
    // Test CORS
    console.log('\n3. Testing CORS configuration...');
    const corsHeaders = languagesResponse.headers.get('access-control-allow-origin');
    console.log('🌐 CORS headers:', corsHeaders || 'Not set');
    
    console.log('\n🎉 All tests passed! Frontend can connect to backend.');
    console.log('\n📝 Next steps:');
    console.log('1. Deploy your frontend to Vercel/Netlify/Replit');
    console.log('2. Set VITE_API_BASE_URL to your backend URL');
    console.log('3. Test the full application workflow');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure the backend API is running');
    console.log('2. Check if the API_BASE_URL is correct');
    console.log('3. Verify CORS configuration in the backend');
    console.log('4. Check firewall and network settings');
    console.log('5. Try testing with: API_BASE_URL=http://localhost:8000 node test-connection.js');
  }
}

// Run the test
testConnection(); 
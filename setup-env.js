const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables for Next.js Image Generation App...\n');

// Check if .env.local already exists
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env.local file already exists');
  const content = fs.readFileSync(envPath, 'utf8');
  if (content.includes('GOOGLE_GENERATIVE_AI_API_KEY')) {
    console.log('✅ Google AI API key configuration found');
    console.log('📝 Current content:');
    console.log(content);
  } else {
    console.log('⚠️  Google AI API key not found in .env.local');
    console.log('📝 Adding Google AI API key configuration...');
    const newContent = content + '\n# Google AI API Key\nGOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here\n';
    fs.writeFileSync(envPath, newContent);
    console.log('✅ Added Google AI API key configuration');
  }
} else {
  console.log('📝 Creating .env.local file...');
  const envContent = `# Google AI API Key
# Get your API key from: https://aistudio.google.com/
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
}

console.log('\n🚀 Next steps:');
console.log('1. Get your Google AI API key from: https://aistudio.google.com/');
console.log('2. Edit the .env.local file and replace "your_google_ai_api_key_here" with your actual API key');
console.log('3. Restart the development server: npm run dev');
console.log('\n📁 Environment file location: ' + envPath);

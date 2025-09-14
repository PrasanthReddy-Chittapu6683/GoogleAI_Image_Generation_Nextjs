# Google AI API Key Setup Guide

## 🔑 How to Get Your Google AI API Key

### Step 1: Visit Google AI Studio
Go to [https://aistudio.google.com/](https://aistudio.google.com/)

### Step 2: Sign In
- Sign in with your Google account
- If you don't have a Google account, create one

### Step 3: Get API Key
1. Click on "Get API key" or "Create API key"
2. You may need to accept terms and conditions
3. Copy the generated API key

### Step 4: Configure Your App
1. Open the `.env.local` file in your project root
2. Replace `your_google_ai_api_key_here` with your actual API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
```

### Step 5: Restart the Server
```bash
npm run dev
```

## 🚨 Important Notes

- **Never commit your API key to version control**
- The `.env.local` file is already in `.gitignore`
- Keep your API key secure and don't share it publicly
- You may have usage limits based on your Google AI Studio plan

## 🧪 Test Your Setup

1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. Go to the Studio page
4. Upload an image and enter a prompt
5. Click "Generate" to test the AI functionality

## 🔧 Troubleshooting

If you're still getting the API key error:

1. **Check the .env.local file exists** in the project root
2. **Verify the API key is correct** (no extra spaces or quotes)
3. **Restart the development server** after adding the key
4. **Check the console** for any error messages

## 📞 Need Help?

- Google AI Studio Documentation: https://ai.google.dev/docs
- Next.js Environment Variables: https://nextjs.org/docs/basic-features/environment-variables

# Image Generation Next.js App

AI-powered photo editing application built with Next.js 15, TypeScript, and Google Gemini AI.

## Features

- Upload images and generate AI-enhanced versions using natural language prompts
- Google Gemini 2.5 Flash integration for image generation
- Modern UI with Tailwind CSS and Radix UI components
- Responsive design with dark/light theme support
- Image history and download functionality

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
```

3. Get your Google AI API key from [Google AI Studio](https://aistudio.google.com/)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **AI Integration**: Vercel AI SDK with Google Gemini
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-image/
│   │       └── route.ts          # API route for image generation
│   ├── studio/
│   │   └── page.tsx              # Studio page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── backgrounds/
│   │   └── grid.tsx              # Grid pattern background
│   └── ui/                       # UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── textarea.tsx
└── lib/
    └── utils.ts                  # Utility functions
```

## Usage

1. Navigate to the home page and click "Go to Studio"
2. Upload an image using the file input
3. Enter a text prompt describing what you want to generate
4. Click "Generate" to create an AI-enhanced version
5. Download the generated image or view it in the history

## Environment Variables

- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google AI API key for image generation

## License

MIT

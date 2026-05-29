# AI Meeting Transcript Summarizer

A React + Express application that summarizes meeting transcripts using Google's Gemini AI.

## Features

- Parse meeting transcripts and generate structured summaries
- Support for Traditional Chinese (繁體中文) and English
- Responsive UI with Tailwind CSS
- Built with React and TypeScript

## Prerequisites

- Node.js 18 or higher
- Google Gemini API key

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment on Render

1. Push your code to a Git repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure the settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variable:
   - **GEMINI_API_KEY**: Your API key
7. Deploy

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

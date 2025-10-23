<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1KacGHP621NbLpe9SiyF1RyGIareiKr_M

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your Gemini API Key:
   - Get your API key from [Google AI Studio](https://ai.google.dev/)
   - Open [.env.local](.env.local) and replace `your_api_key_here` with your actual API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open your browser at [http://localhost:3000](http://localhost:3000)

## Features

- Drag & drop CSV file upload
- File validation (max 5MB, CSV files only)
- Robust CSV parsing with support for quoted values and commas
- AI-powered conversion to JSON using Google Gemini
- Live preview of CSV data
- Copy and download JSON output
- Responsive design

---
title: Pangandaran AI Chatbot
emoji: 🌊
colorFrom: green
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# Pangandaran.ai — Tourism Chatbot

AI-powered tourism assistant for Pangandaran, West Java, Indonesia.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **State**: Redux Toolkit
- **Styling**: CSS Modules
- **Deploy**: Docker on Hugging Face Spaces

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Docker

```bash
docker build -t pangandaran-ai .
docker run -p 7860:7860 pangandaran-ai
```

Open [http://localhost:7860](http://localhost:7860)

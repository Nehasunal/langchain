# LangChain Framework (TypeScript)

Small TypeScript examples that show how to use LangChain with Google Gemini models.

## What is included

- `agent1.ts`: Basic direct LLM invocation (asks for the capital of France).
- `llmchains.ts`: Prompt template + parser + `LLMChain` example for personalized explanations.

## Prerequisites

- Node.js 18+
- npm
- A Google AI API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add environment variables in `.env`:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

## Run examples

### 1) Basic LLM call

```bash
npm run start:agent1
```

### 2) Prompt template + chain

```bash
npm run start:prompt
```

## Current package notes

- Project uses ESM (`"type": "module"` in `package.json`).
- `tsx` is used to run TypeScript files directly.
- `@langchain/google-genai` is currently used for Gemini.

## Troubleshooting

- If you get authentication errors, confirm `GOOGLE_API_KEY` is set correctly in `.env`.
- If command execution fails, make sure dependencies are installed (`npm install`).

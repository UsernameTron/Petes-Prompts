# Film Effects Translator for Hailuo AI

This web application helps users enhance their Hailuo AI video generation prompts by providing a library of film effects terminology with plain English explanations.

## Features

- Translate film terminology into plain English explanations
- Browse a comprehensive library of film effects organized by categories
- Build enhanced prompts by adding technical film terms
- Use example prompts to understand the enhancement process
- Copy optimized prompts to clipboard for use with Hailuo AI

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```
npm run build
```

## Deployment to Netlify

This project is configured for easy deployment to Netlify:

1. Push your code to a GitHub repository
2. Connect the repository to Netlify
3. Netlify will automatically detect the build settings from netlify.toml

Alternatively, you can deploy directly from your local machine:

```
netlify deploy --prod
```

## Technology Stack

- React
- TailwindCSS
- Netlify for hosting

## Using the Tool

1. Enter your basic prompt (e.g., "A woman walks through a garden")
2. Select a category of film effects, then choose specific effects
3. Add selected effects to your prompt
4. Generate an enhanced prompt
5. Copy the enhanced prompt to use with Hailuo AI
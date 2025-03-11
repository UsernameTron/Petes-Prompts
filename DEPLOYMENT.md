# Deployment Guide for Film Effects Translator

This guide provides instructions for deploying the Film Effects Translator web application to Netlify.

## Option 1: Deploy from GitHub

This is the recommended approach for ongoing development and CI/CD pipeline:

1. Push your code to a GitHub repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. Log in to [Netlify](https://app.netlify.com/)

3. Click "New site from Git" and select your GitHub repository

4. Use the following settings:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Advanced settings: Click and add any environment variables if needed

5. Click "Deploy site"

Netlify will automatically build and deploy your site. Any future pushes to your GitHub repository will trigger a new deployment.

## Option 2: Deploy using Netlify CLI

For quick deployment directly from your local machine:

1. Install Netlify CLI if you haven't already:
   ```
   npm install -g netlify-cli
   ```

2. Build your project:
   ```
   npm run build
   ```

3. Log in to Netlify:
   ```
   netlify login
   ```

4. Initialize your site:
   ```
   netlify init
   ```
   - Select "Create & configure a new site"
   - Choose your team
   - Enter a site name (or press Enter for a random name)

5. Deploy your site:
   ```
   netlify deploy --prod
   ```

## Custom Domain Configuration

To configure a custom domain:

1. Go to your site settings in Netlify dashboard
2. Navigate to "Domain management" → "Domains"
3. Click "Add custom domain"
4. Follow the instructions to configure your DNS settings

## Environment Variables

If your application requires environment variables:

1. Go to your site settings in Netlify dashboard
2. Navigate to "Build & deploy" → "Environment"
3. Click "Edit variables" and add your variables

## Continuous Deployment

Netlify automatically sets up continuous deployment when connecting to a GitHub repository. Each push to your main branch will trigger a new build and deployment.

## Troubleshooting

If you encounter any issues during deployment:

- Check the build logs in Netlify dashboard
- Ensure all dependencies are properly listed in package.json
- Verify that the build command and publish directory are correctly specified
- Make sure your code works locally by running `npm run build` and checking the output

For more information, visit [Netlify Documentation](https://docs.netlify.com/).
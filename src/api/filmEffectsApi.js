// API layer for Film Effects Translator
// This is a simple implementation that could be extended to 
// fetch data from a backend service in the future

import { FILM_EFFECTS, CATEGORIES, EXAMPLE_PROMPTS } from '../data/filmEffectsData';

export const getFilmEffects = () => {
  return Promise.resolve(FILM_EFFECTS);
};

export const getCategories = () => {
  return Promise.resolve(CATEGORIES);
};

export const getExamplePrompts = () => {
  return Promise.resolve(EXAMPLE_PROMPTS);
};

export const analyzeMentionedEffects = (text) => {
  const mentionedEffects = [];
  
  Object.keys(FILM_EFFECTS).forEach(effect => {
    if (text.toLowerCase().includes(effect.toLowerCase())) {
      mentionedEffects.push(effect);
    }
  });
  
  return Promise.resolve(mentionedEffects);
};

export const generateEnhancedPrompt = (basicPrompt, selectedEffects) => {
  if (!basicPrompt || selectedEffects.length === 0) {
    return Promise.resolve("");
  }
  
  let prompt = basicPrompt;
  // Add period if needed
  if (prompt && !prompt.match(/[.!?]$/)) {
    prompt += '.';
  }
  
  // Add effects
  prompt += ` The scene is captured with ${selectedEffects.join(', ')}.`;
  
  return Promise.resolve(prompt);
};
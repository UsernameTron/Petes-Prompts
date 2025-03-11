// API layer for Film Effects Translator
// This is a simple implementation that could be extended to 
// fetch data from a backend service in the future

import { FILM_EFFECTS, CATEGORIES, EXAMPLE_PROMPTS } from '../data/filmEffectsData';
import { 
  GENERATION_TYPES, 
  TEMPLATE_DATA, 
  EXAMPLE_PROMPTS as TEMPLATE_EXAMPLES,
  generatePrompt,
  getRecommendedCategories,
  getStructureInfo,
  analyzePromptForSuggestions
} from '../data/promptTemplates';

export const getFilmEffects = () => {
  return Promise.resolve(FILM_EFFECTS);
};

export const getCategories = () => {
  return Promise.resolve(CATEGORIES);
};

export const getExamplePrompts = () => {
  return Promise.resolve(EXAMPLE_PROMPTS);
};

export const getGenerationTypes = () => {
  return Promise.resolve(GENERATION_TYPES);
};

export const getTemplateData = () => {
  return Promise.resolve(TEMPLATE_DATA);
};

export const getTemplateExamples = () => {
  return Promise.resolve(TEMPLATE_EXAMPLES);
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

export const getSuggestedEffects = (promptText, generationType) => {
  return Promise.resolve(analyzePromptForSuggestions(promptText, generationType));
};

export const getRecommendedEffectCategories = (generationType) => {
  return Promise.resolve(getRecommendedCategories(generationType));
};

export const getPromptStructure = (generationType) => {
  return Promise.resolve(getStructureInfo(generationType));
};

export const generateEnhancedPrompt = (
  basicPrompt, 
  selectedEffects, 
  generationType = GENERATION_TYPES.TEXT_TO_VIDEO_BASIC
) => {
  if (!basicPrompt || selectedEffects.length === 0) {
    return Promise.resolve("");
  }
  
  const inputs = { basicPrompt };
  
  // Use the prompt template system to generate the enhanced prompt
  const prompt = generatePrompt(generationType, inputs, selectedEffects);
  
  return Promise.resolve(prompt);
};
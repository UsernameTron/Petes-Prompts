// src/data/promptTemplates.js
// Template structures and helper functions for film effect prompts

import { FILM_EFFECTS, CATEGORIES } from './filmEffectsData';

// Generation types
export const GENERATION_TYPES = {
  TEXT_TO_VIDEO_BASIC: "text-to-video-basic",
  TEXT_TO_VIDEO_PRECISE: "text-to-video-precise",
  IMAGE_TO_VIDEO: "image-to-video",
  SUBJECT_REFERENCE: "subject-reference"
};

// Template data for each generation type
export const TEMPLATE_DATA = {
  [GENERATION_TYPES.TEXT_TO_VIDEO_BASIC]: {
    name: "Text-to-Video Basic",
    description: "Simple video generation with main subject, scene, and motion",
    icon: "✍️",
    iconBgColor: "bg-blue-600",
    example: "A cat plays with a ball of yarn in a cozy living room",
    structure: {
      mainSubject: "Required - Person, animal, or object (e.g., 'a man', 'a cat')",
      scene: "Required - Setting or location (e.g., 'in a garden', 'on a beach')",
      motion: "Required - Action or movement (e.g., 'walking', 'jumping')",
      cameraMovement: "Optional - How the camera behaves (e.g., 'tracking shot')",
      visualStyle: "Optional - Visual treatment (e.g., '35mm film', 'golden hour')"
    },
    recommendedCategories: ["Film Look", "Lighting", "Camera Movement"]
  },
  
  [GENERATION_TYPES.TEXT_TO_VIDEO_PRECISE]: {
    name: "Text-to-Video Precise",
    description: "Detailed video generation with cinematic qualities",
    icon: "🎬",
    iconBgColor: "bg-purple-600",
    example: "A woman in a red dress walks slowly through an abandoned train station at sunset. The camera tracks alongside her, capturing her silhouette against warm golden light streaming through dusty windows.",
    structure: {
      mainSubject: "Required - Detailed description of subject (e.g., 'a woman in a red dress')",
      scene: "Required - Detailed setting description (e.g., 'abandoned train station at sunset')",
      motion: "Required - Specific action or movement (e.g., 'walks slowly')",
      cameraMovement: "Required - Specific camera technique (e.g., 'tracking shot')",
      visualStyle: "Required - Visual treatment (e.g., 'golden hour lighting', 'anamorphic lens')",
      mood: "Recommended - Emotional quality (e.g., 'melancholic atmosphere')"
    },
    recommendedCategories: ["Film Look", "Lighting", "Camera Movement", "Camera Perspective", "Lens Effects", "Mood"]
  },
  
  [GENERATION_TYPES.IMAGE_TO_VIDEO]: {
    name: "Image-to-Video",
    description: "Animate a still image with motion and effects",
    icon: "🖼️",
    iconBgColor: "bg-green-600",
    example: "In the image, clouds begin to move across the sky while leaves gently sway in the breeze. The camera slowly zooms out to reveal more of the landscape.",
    structure: {
      referencePrefix: "Required - 'In the image' or 'In this scene'",
      motion: "Required - How elements in the image will move (e.g., 'clouds begin to move')",
      cameraMovement: "Recommended - How camera behaves (e.g., 'camera slowly zooms out')",
      transition: "Optional - Changes that occur (e.g., 'day transitions to night')",
      visualStyle: "Optional - Visual treatment (e.g., 'dreamy atmosphere')"
    },
    recommendedCategories: ["Camera Movement", "Special Visual Techniques", "Atmosphere"]
  },
  
  [GENERATION_TYPES.SUBJECT_REFERENCE]: {
    name: "Subject Reference",
    description: "Use a reference image of a subject in a new scene",
    icon: "👤",
    iconBgColor: "bg-red-600",
    example: "The subject wearing a dark blue suit stands in front of a modern glass building. He gestures confidently while speaking to a small group. The camera slowly circles around him, capturing his professional demeanor.",
    structure: {
      subjectReference: "Required - 'The subject' or 'The model' or 'The person'",
      subjectDetail: "Recommended - Clothing, appearance details (e.g., 'wearing a dark blue suit')",
      scene: "Required - New environment (e.g., 'in front of a modern glass building')",
      action: "Required - What subject is doing (e.g., 'gestures confidently while speaking')",
      cameraMovement: "Recommended - How camera captures subject (e.g., 'slowly circles around')",
      visualStyle: "Recommended - Visual treatment (e.g., 'corporate atmosphere')"
    },
    recommendedCategories: ["Camera Movement", "Lighting", "Mood", "Camera Perspective"]
  }
};

// Helper function to get recommended categories for a generation type
export const getRecommendedCategories = (generationType) => {
  return TEMPLATE_DATA[generationType]?.recommendedCategories || [];
};

// Helper function to get structure information for a generation type
export const getStructureInfo = (generationType) => {
  return TEMPLATE_DATA[generationType]?.structure || {};
};

// Format effects by category for better prompt organization
export const categorizeEffects = (selectedEffects) => {
  const categorized = {};
  
  selectedEffects.forEach(effect => {
    // Find which category this effect belongs to
    for (const [category, effects] of Object.entries(CATEGORIES)) {
      if (effects.includes(effect)) {
        if (!categorized[category]) {
          categorized[category] = [];
        }
        categorized[category].push(effect);
        break;
      }
    }
  });
  
  return categorized;
};

// Generate a prompt based on the selected generation type and inputs
export const generatePrompt = (generationType, inputs, selectedEffects) => {
  switch (generationType) {
    case GENERATION_TYPES.TEXT_TO_VIDEO_BASIC:
      return generateBasicPrompt(inputs, selectedEffects);
    case GENERATION_TYPES.TEXT_TO_VIDEO_PRECISE:
      return generatePrecisePrompt(inputs, selectedEffects);
    case GENERATION_TYPES.IMAGE_TO_VIDEO:
      return generateImageToVideoPrompt(inputs, selectedEffects);
    case GENERATION_TYPES.SUBJECT_REFERENCE:
      return generateSubjectReferencePrompt(inputs, selectedEffects);
    default:
      return generateBasicPrompt(inputs, selectedEffects);
  }
};

// Generate a basic text-to-video prompt
const generateBasicPrompt = (inputs, selectedEffects) => {
  let prompt = inputs.basicPrompt || "";
  
  // Add period if needed
  if (prompt && !prompt.match(/[.!?]$/)) {
    prompt += '.';
  }
  
  // Add selected effects
  if (selectedEffects.length > 0) {
    prompt += ` The scene is captured with ${selectedEffects.join(', ')}.`;
  }
  
  return prompt;
};

// Generate a precise text-to-video prompt with more cinematic structure
const generatePrecisePrompt = (inputs, selectedEffects) => {
  let prompt = inputs.basicPrompt || "";
  
  // Add period if needed
  if (prompt && !prompt.match(/[.!?]$/)) {
    prompt += '.';
  }
  
  // Categorize effects
  const categorizedEffects = categorizeEffects(selectedEffects);
  
  // Add camera movement
  if (categorizedEffects['Camera Movement'] && categorizedEffects['Camera Movement'].length > 0) {
    prompt += ` The camera ${categorizedEffects['Camera Movement'].map(cm => 
      cm.toLowerCase().includes('shot') ? cm : `uses ${cm}`
    ).join(' and ')}.`;
  }
  
  // Add lighting effects
  if (categorizedEffects['Lighting'] && categorizedEffects['Lighting'].length > 0) {
    prompt += ` ${categorizedEffects['Lighting'].join(' and ')} illuminates the scene.`;
  }
  
  // Add film look and lens effects
  const visualEffects = [
    ...(categorizedEffects['Film Look'] || []),
    ...(categorizedEffects['Lens Effects'] || [])
  ];
  
  if (visualEffects.length > 0) {
    prompt += ` Shot with ${visualEffects.join(', ')}.`;
  }
  
  // Add mood/atmosphere
  if (categorizedEffects['Mood'] && categorizedEffects['Mood'].length > 0) {
    prompt += ` Creates a ${categorizedEffects['Mood'].join(' and ')} feeling.`;
  }
  
  // Add any other effects
  const otherCategories = Object.keys(categorizedEffects).filter(cat => 
    !['Camera Movement', 'Lighting', 'Film Look', 'Lens Effects', 'Mood'].includes(cat)
  );
  
  const otherEffects = otherCategories.flatMap(cat => categorizedEffects[cat]);
  
  if (otherEffects.length > 0) {
    prompt += ` Also features ${otherEffects.join(', ')}.`;
  }
  
  return prompt;
};

// Generate an image-to-video prompt
const generateImageToVideoPrompt = (inputs, selectedEffects) => {
  let prefix = "In the image, ";
  let content = inputs.basicPrompt || "";
  
  // Remove "in the image" if it's already in the content
  if (content.toLowerCase().startsWith("in the image")) {
    content = content.substring(12);
  } else if (content.toLowerCase().startsWith("in this scene")) {
    content = content.substring(14);
  }
  
  // Create the base prompt
  let prompt = prefix + content;
  
  // Add period if needed
  if (prompt && !prompt.match(/[.!?]$/)) {
    prompt += '.';
  }
  
  // Categorize effects
  const categorizedEffects = categorizeEffects(selectedEffects);
  
  // Add camera movement (most important for I2V)
  if (categorizedEffects['Camera Movement'] && categorizedEffects['Camera Movement'].length > 0) {
    prompt += ` The camera ${categorizedEffects['Camera Movement'].map(cm => 
      cm.toLowerCase().includes('shot') ? cm : `uses ${cm}`
    ).join(' and ')}.`;
  }
  
  // Add special effects
  if (categorizedEffects['Special Visual Techniques'] && categorizedEffects['Special Visual Techniques'].length > 0) {
    prompt += ` The sequence features ${categorizedEffects['Special Visual Techniques'].join(' and ')}.`;
  }
  
  // Add atmosphere
  if (categorizedEffects['Atmosphere'] && categorizedEffects['Atmosphere'].length > 0) {
    prompt += ` The scene has ${categorizedEffects['Atmosphere'].join(' and ')}.`;
  }
  
  // Add any other effects
  const otherCategories = Object.keys(categorizedEffects).filter(cat => 
    !['Camera Movement', 'Special Visual Techniques', 'Atmosphere'].includes(cat)
  );
  
  const otherEffects = otherCategories.flatMap(cat => categorizedEffects[cat]);
  
  if (otherEffects.length > 0) {
    prompt += ` Also features ${otherEffects.join(', ')}.`;
  }
  
  return prompt;
};

// Generate a subject reference prompt
const generateSubjectReferencePrompt = (inputs, selectedEffects) => {
  let prompt = "The subject ";
  let content = inputs.basicPrompt || "";
  
  // Remove "the subject" if it's already in the content
  if (content.toLowerCase().startsWith("the subject")) {
    content = content.substring(11);
  } else if (content.toLowerCase().startsWith("the model")) {
    content = content.substring(10);
  } else if (content.toLowerCase().startsWith("the person")) {
    content = content.substring(11);
  }
  
  // Create the base prompt
  prompt += content;
  
  // Add period if needed
  if (prompt && !prompt.match(/[.!?]$/)) {
    prompt += '.';
  }
  
  // Categorize effects
  const categorizedEffects = categorizeEffects(selectedEffects);
  
  // Add camera movement
  if (categorizedEffects['Camera Movement'] && categorizedEffects['Camera Movement'].length > 0) {
    prompt += ` The camera ${categorizedEffects['Camera Movement'].map(cm => 
      cm.toLowerCase().includes('shot') ? cm : `uses ${cm}`
    ).join(' and ')}.`;
  }
  
  // Add lighting effects
  if (categorizedEffects['Lighting'] && categorizedEffects['Lighting'].length > 0) {
    prompt += ` ${categorizedEffects['Lighting'].join(' and ')} illuminates the subject.`;
  }
  
  // Add mood/atmosphere
  if (categorizedEffects['Mood'] && categorizedEffects['Mood'].length > 0) {
    prompt += ` Creates a ${categorizedEffects['Mood'].join(' and ')} feeling.`;
  }
  
  // Add camera perspective
  if (categorizedEffects['Camera Perspective'] && categorizedEffects['Camera Perspective'].length > 0) {
    prompt += ` Shot from ${categorizedEffects['Camera Perspective'].join(' and ')}.`;
  }
  
  // Add any other effects
  const otherCategories = Object.keys(categorizedEffects).filter(cat => 
    !['Camera Movement', 'Lighting', 'Mood', 'Camera Perspective'].includes(cat)
  );
  
  const otherEffects = otherCategories.flatMap(cat => categorizedEffects[cat]);
  
  if (otherEffects.length > 0) {
    prompt += ` Also features ${otherEffects.join(', ')}.`;
  }
  
  return prompt;
};

// Example prompts for each generation type
export const EXAMPLE_PROMPTS = {
  [GENERATION_TYPES.TEXT_TO_VIDEO_BASIC]: [
    {
      title: "Simple Scene",
      before: "A cat plays with a ball of yarn",
      after: "A cat plays with a ball of yarn. The scene is captured with shallow depth of field, golden hour lighting, 35mm film.",
      effects: ["Shallow depth of field", "Golden hour", "35mm film"]
    },
    {
      title: "Nature Scene",
      before: "A stream flows through a forest",
      after: "A stream flows through a forest. The scene is captured with tracking shot, dappled light, 16mm film.",
      effects: ["Tracking shot", "Dappled light", "16mm film"]
    }
  ],
  
  [GENERATION_TYPES.TEXT_TO_VIDEO_PRECISE]: [
    {
      title: "Cinematic Character Scene",
      before: "A detective examines evidence in an abandoned warehouse",
      after: "A detective examines evidence in an abandoned warehouse. The camera uses a dolly shot and low angle shot. Low-key lighting illuminates the scene. Shot with anamorphic lens, film grain. Creates a tense atmosphere feeling.",
      effects: ["Dolly shot", "Low angle shot", "Low-key lighting", "Anamorphic lens", "Film grain", "Tense atmosphere"]
    },
    {
      title: "Dynamic Action Scene",
      before: "A motorcyclist races through city streets at night",
      after: "A motorcyclist races through city streets at night. The camera uses a tracking shot and whip pan. Neon lighting illuminates the scene. Shot with anamorphic lens, shallow depth of field. Creates a tense atmosphere feeling. Also features light leaks, lens flare.",
      effects: ["Tracking shot", "Whip pan", "Neon lighting", "Anamorphic lens", "Shallow depth of field", "Tense atmosphere", "Light leaks", "Lens flare"]
    }
  ],
  
  [GENERATION_TYPES.IMAGE_TO_VIDEO]: [
    {
      title: "Nature Animation",
      before: "In the image, trees sway gently as clouds move across the sky",
      after: "In the image, trees sway gently as clouds move across the sky. The camera uses a slow push in. The sequence features timelapse. The scene has fog.",
      effects: ["Slow push in", "Timelapse", "Fog"]
    },
    {
      title: "Portrait Animation",
      before: "In the image, a woman's hair moves in the breeze as she slowly turns to face the camera",
      after: "In the image, a woman's hair moves in the breeze as she slowly turns to face the camera. The camera uses a dolly shot. The sequence features slow motion. The scene has golden hour lighting.",
      effects: ["Dolly shot", "Slow motion", "Golden hour lighting"]
    }
  ],
  
  [GENERATION_TYPES.SUBJECT_REFERENCE]: [
    {
      title: "Professional Setting",
      before: "The subject wearing a suit presents to a group in a modern office",
      after: "The subject wearing a suit presents to a group in a modern office. The camera uses a tracking shot. High-key lighting illuminates the subject. Creates a professional atmosphere feeling. Shot from medium shot.",
      effects: ["Tracking shot", "High-key lighting", "Professional atmosphere", "Medium shot"]
    },
    {
      title: "Outdoor Adventure",
      before: "The subject hiking along a mountain trail with a backpack",
      after: "The subject hiking along a mountain trail with a backpack. The camera uses a drone shot. Golden hour lighting illuminates the subject. Creates a adventurous atmosphere feeling. Shot from high angle shot.",
      effects: ["Drone shot", "Golden hour lighting", "Adventurous atmosphere", "High angle shot"]
    }
  ]
};

// Analyze a prompt to suggest suitable effects
export const analyzePromptForSuggestions = (prompt, generationType) => {
  const suggestions = [];
  const lowercasePrompt = prompt.toLowerCase();
  
  // Suggest camera movements based on content
  if (generationType === GENERATION_TYPES.TEXT_TO_VIDEO_PRECISE || 
      generationType === GENERATION_TYPES.SUBJECT_REFERENCE) {
    // Action scenes benefit from tracking shots
    if (lowercasePrompt.includes("run") || 
        lowercasePrompt.includes("race") || 
        lowercasePrompt.includes("chase")) {
      suggestions.push("Tracking shot");
    }
    
    // Emotional scenes benefit from push in
    if (lowercasePrompt.includes("sad") || 
        lowercasePrompt.includes("happy") || 
        lowercasePrompt.includes("emotion")) {
      suggestions.push("Push in");
    }
    
    // Landscapes benefit from drone shots
    if (lowercasePrompt.includes("landscape") || 
        lowercasePrompt.includes("mountain") || 
        lowercasePrompt.includes("aerial")) {
      suggestions.push("Drone shot");
    }
  }
  
  // Suggest lighting based on content
  if (lowercasePrompt.includes("sunset") || 
      lowercasePrompt.includes("warm") || 
      lowercasePrompt.includes("dusk")) {
    suggestions.push("Golden hour");
  }
  
  if (lowercasePrompt.includes("night") || 
      lowercasePrompt.includes("dark") || 
      lowercasePrompt.includes("shadow")) {
    suggestions.push("Low-key lighting");
  }
  
  if (lowercasePrompt.includes("bright") || 
      lowercasePrompt.includes("daylight") || 
      lowercasePrompt.includes("sunny")) {
    suggestions.push("High-key lighting");
  }
  
  // Suggest atmosphere based on content
  if (lowercasePrompt.includes("scary") || 
      lowercasePrompt.includes("horror") || 
      lowercasePrompt.includes("fear")) {
    suggestions.push("Eerie atmosphere");
  }
  
  if (lowercasePrompt.includes("love") || 
      lowercasePrompt.includes("romantic") || 
      lowercasePrompt.includes("couple")) {
    suggestions.push("Romantic atmosphere");
  }
  
  if (lowercasePrompt.includes("old") || 
      lowercasePrompt.includes("memory") || 
      lowercasePrompt.includes("past")) {
    suggestions.push("Nostalgic atmosphere");
  }
  
  // Suggest film look based on content
  if (lowercasePrompt.includes("vintage") || 
      lowercasePrompt.includes("retro") || 
      lowercasePrompt.includes("old")) {
    suggestions.push("8mm vintage film");
  }
  
  if (lowercasePrompt.includes("cinematic") || 
      lowercasePrompt.includes("movie") || 
      lowercasePrompt.includes("film")) {
    suggestions.push("35mm Kodachrome");
  }
  
  return suggestions;
};
import React, { useState, useEffect } from 'react';
import { 
  getFilmEffects, 
  getCategories, 
  getExamplePrompts, 
  analyzeMentionedEffects,
  generateEnhancedPrompt,
  getGenerationTypes,
  getTemplateData,
  getTemplateExamples,
  getPromptStructure,
  getSuggestedEffects
} from '../api/filmEffectsApi';
import GenerationTypeSelector from './GenerationTypeSelector';
import PromptStructurePreview from './PromptStructurePreview';

const FilmEffectsTranslator = () => {
  const [activeTab, setActiveTab] = useState('translator');
  const [basicPrompt, setBasicPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Film Look');
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [selectedEffects, setSelectedEffects] = useState([]);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  
  // New state for generation types
  const [generationType, setGenerationType] = useState('text-to-video-basic');
  const [generationTypes, setGenerationTypes] = useState({});
  const [templateData, setTemplateData] = useState({});
  const [templateExamples, setTemplateExamples] = useState({});
  const [structureInfo, setStructureInfo] = useState({});
  const [suggestedEffects, setSuggestedEffects] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // State for storing data from API
  const [filmEffects, setFilmEffects] = useState({});
  const [categories, setCategories] = useState({});
  const [examplePrompts, setExamplePrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          effectsData, 
          categoriesData, 
          examplesData,
          generationTypesData,
          templateDataResult,
          templateExamplesResult
        ] = await Promise.all([
          getFilmEffects(),
          getCategories(),
          getExamplePrompts(),
          getGenerationTypes(),
          getTemplateData(),
          getTemplateExamples()
        ]);
        
        setFilmEffects(effectsData);
        setCategories(categoriesData);
        setExamplePrompts(examplesData);
        setGenerationTypes(generationTypesData);
        setTemplateData(templateDataResult);
        setTemplateExamples(templateExamplesResult);
        
        // Get structure for default generation type
        const structure = await getPromptStructure(generationType);
        setStructureInfo(structure);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update effect options when category changes
  const effectOptions = categories[selectedCategory] || [];

  // Handle generation type change
  const handleGenerationTypeChange = async (type) => {
    setGenerationType(type);
    
    // Update structure info
    try {
      const structure = await getPromptStructure(type);
      setStructureInfo(structure);
      
      // Get suggestions based on the new type and current prompt
      if (basicPrompt) {
        const suggestions = await getSuggestedEffects(basicPrompt, type);
        setSuggestedEffects(suggestions);
        setShowSuggestions(suggestions.length > 0);
      }
    } catch (error) {
      console.error("Error updating structure info:", error);
    }
  };

  // Handle adding an effect to the selection
  const addEffect = () => {
    if (!selectedEffect) return;
    
    if (!selectedEffects.includes(selectedEffect)) {
      setSelectedEffects([...selectedEffects, selectedEffect]);
    }
  };
  
  // Add a suggested effect
  const addSuggestedEffect = (effect) => {
    if (!selectedEffects.includes(effect)) {
      setSelectedEffects([...selectedEffects, effect]);
    }
  };

  // Generate enhanced prompt
  const handleGeneratePrompt = async () => {
    if (!basicPrompt || selectedEffects.length === 0) return;
    
    try {
      const prompt = await generateEnhancedPrompt(basicPrompt, selectedEffects, generationType);
      setEnhancedPrompt(prompt);
    } catch (error) {
      console.error("Error generating prompt:", error);
    }
  };

  // Handle prompt text change
  const handlePromptChange = async (text) => {
    setBasicPrompt(text);
    
    // Get suggestions if text is long enough
    if (text.length > 10) {
      try {
        const suggestions = await getSuggestedEffects(text, generationType);
        setSuggestedEffects(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } catch (error) {
        console.error("Error getting suggestions:", error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  // Clear all fields
  const clearAll = () => {
    setBasicPrompt('');
    setSelectedEffects([]);
    setEnhancedPrompt('');
    setShowSuggestions(false);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    if (!enhancedPrompt) return;
    
    navigator.clipboard.writeText(enhancedPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Handle example selection
  const handleExampleSelection = async (example) => {
    setActiveTab('translator');
    setBasicPrompt(example.before);
    
    try {
      // Extract effects mentioned in the after text
      const mentionedEffects = await analyzeMentionedEffects(example.after);
      setSelectedEffects(mentionedEffects);
      setEnhancedPrompt(example.after);
      
      // Get suggestions based on the example
      const suggestions = await getSuggestedEffects(example.before, generationType);
      setSuggestedEffects(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error("Error analyzing example:", error);
    }
  };
  
  // Handle template example selection
  const handleTemplateExampleSelection = async (example) => {
    setBasicPrompt(example.before);
    setSelectedEffects(example.effects || []);
    setEnhancedPrompt(example.after);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading Film Effects Translator...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Film Effects Translator for Hailuo AI</h1>
        
        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-6">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'translator' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('translator')}
          >
            Prompt Translator
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'library' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('library')}
          >
            Effects Library
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'examples' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('examples')}
          >
            Example Prompts
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'templates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('templates')}
          >
            Prompt Templates
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('about')}
          >
            About & Help
          </button>
        </div>
        
        {/* Translator Tab */}
        {activeTab === 'translator' && (
          <div>
            <p className="text-lg mb-4 text-center">Enter your basic prompt, select a generation type, then add film effects</p>
            
            {/* Generation Type Selector */}
            <GenerationTypeSelector 
              generationTypes={generationTypes}
              selectedType={generationType}
              onSelectType={handleGenerationTypeChange}
              templateData={templateData}
            />
            
            {/* Prompt Structure Preview */}
            <PromptStructurePreview 
              generationType={generationType}
              structureInfo={structureInfo}
              templateExamples={templateExamples}
            />
            
            {/* Input section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Basic Prompt</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                value={basicPrompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                placeholder="Enter a simple description of your video (e.g., 'A woman walks through a garden')"
              ></textarea>
            </div>
            
            {/* Suggested Effects */}
            {showSuggestions && suggestedEffects.length > 0 && (
              <div className="mb-6 p-3 bg-blue-50 rounded-md border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-blue-800">Suggested Effects</h3>
                  <button
                    className="text-xs text-blue-600 hover:text-blue-800"
                    onClick={() => setShowSuggestions(false)}
                  >
                    Hide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedEffects.map(effect => (
                    <button
                      key={effect}
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedEffects.includes(effect)
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200'
                      }`}
                      onClick={() => addSuggestedEffect(effect)}
                      disabled={selectedEffects.includes(effect)}
                    >
                      {effect} {selectedEffects.includes(effect) && '✓'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Effects selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Film Effects</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left column */}
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Select a category:</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {Object.keys(categories).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <label className="block text-sm text-gray-500 mb-1">Select an effect:</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedEffect || ''}
                    onChange={(e) => setSelectedEffect(e.target.value)}
                  >
                    <option value="">-- Select an effect --</option>
                    {effectOptions.map(effect => (
                      <option key={effect} value={effect}>{effect}</option>
                    ))}
                  </select>
                  
                  <div className="bg-gray-100 p-3 rounded-md mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">What it means:</p>
                    <p className="text-sm text-gray-600">
                      {selectedEffect ? filmEffects[selectedEffect] : "Select an effect to see its meaning"}
                    </p>
                  </div>
                  
                  <button 
                    className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    onClick={addEffect}
                    disabled={!selectedEffect}
                  >
                    Add Selected Effect to Prompt
                  </button>
                </div>
                
                {/* Right column */}
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Your selected effects:</label>
                  <div className="border border-gray-300 rounded-md p-3 min-h-40 mb-4">
                    {selectedEffects.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedEffects.map(effect => (
                          <div key={effect} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                            {effect}
                            <button 
                              className="ml-1 text-blue-500 hover:text-blue-700"
                              onClick={() => setSelectedEffects(selectedEffects.filter(e => e !== effect))}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No effects selected yet</p>
                    )}
                  </div>
                  
                  <button 
                    className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mb-4"
                    onClick={() => setSelectedEffects([])}
                    disabled={selectedEffects.length === 0}
                  >
                    Clear Selected Effects
                  </button>
                </div>
              </div>
            </div>
            
            {/* Output section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Enhanced Prompt</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                rows="4"
                value={enhancedPrompt}
                onChange={(e) => setEnhancedPrompt(e.target.value)}
                placeholder="Your enhanced prompt will appear here"
              ></textarea>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => handleGeneratePrompt()}
                disabled={!basicPrompt || selectedEffects.length === 0}
              >
                Generate Enhanced Prompt
              </button>
              
              <button 
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                onClick={copyToClipboard}
                disabled={!enhancedPrompt}
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
              
              <button 
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>
          </div>
        )}
        
        {/* Library Tab */}
        {activeTab === 'library' && (
          <div>
            <p className="text-lg mb-4 text-center">Browse the complete film effects library</p>
            
            <div className="overflow-auto max-h-96">
              <div className="space-y-6">
                {Object.entries(categories).map(([category, effects]) => (
                  <div key={category} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-100 p-3 font-medium">{category}</div>
                    <div className="divide-y">
                      {effects.map(effect => (
                        <div key={effect} className="p-3 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center">
                          <div className="font-medium text-blue-800 sm:w-1/3">{effect}</div>
                          <div className="text-gray-600 sm:w-2/3">{filmEffects[effect]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <div>
            <p className="text-lg mb-4 text-center">Example prompts showing before and after enhancement</p>
            
            <div className="space-y-6">
              {examplePrompts.map((example, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-50 p-3 font-medium text-blue-800">{example.title}</div>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Basic prompt:</p>
                      <p className="bg-gray-50 p-2 rounded border border-gray-200">{example.before}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Enhanced prompt:</p>
                      <p className="bg-gray-50 p-2 rounded border border-gray-200">{example.after}</p>
                    </div>
                    
                    <button 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 text-sm float-right"
                      onClick={() => handleExampleSelection(example)}
                    >
                      Use This Example
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <p className="text-lg mb-4 text-center">Browse different prompt templates by generation type</p>
            
            <div className="space-y-6">
              {Object.entries(templateExamples).map(([type, examples]) => {
                if (!examples || examples.length === 0) return null;
                
                const typeInfo = templateData[type] || {};
                const example = examples[0];
                
                return (
                  <div key={type} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-purple-50 p-3 font-medium text-purple-800">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${typeInfo.iconBgColor || 'bg-purple-600'} text-white mr-2`}>
                          {typeInfo.icon || '🔤'}
                        </div>
                        <span>{typeInfo.name || type}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                        <p className="text-gray-600">{typeInfo.description || "Template for generation"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Example:</p>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500">Before:</p>
                          <p className="bg-gray-50 p-2 rounded border border-gray-200">{example.before}</p>
                          <p className="text-xs text-gray-500">After:</p>
                          <p className="bg-gray-50 p-2 rounded border border-gray-200">{example.after}</p>
                          <p className="text-xs text-gray-500">Effects used:</p>
                          <div className="flex flex-wrap gap-1">
                            {example.effects && example.effects.map(effect => (
                              <span key={effect} className="bg-purple-100 text-purple-800 px-2 py-0.5 text-xs rounded-full">
                                {effect}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded hover:bg-purple-200 focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 text-sm float-right"
                        onClick={() => {
                          setGenerationType(type);
                          handleTemplateExampleSelection(example);
                          setActiveTab('translator');
                        }}
                      >
                        Use This Template
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* About Tab */}
        {activeTab === 'about' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-center">About Film Effects Translator</h2>
            
            <div className="prose max-w-none">
              <p>This tool helps translate film terminology into plain English, while preserving the technical terms that Hailuo AI uses to generate better video results.</p>
              
              <h3 className="font-bold mt-6 mb-2">HOW TO USE THIS TOOL:</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Select a generation type that matches your needs (Text-to-Video Basic, Text-to-Video Precise, Image-to-Video, or Subject Reference).</li>
                <li>Enter your basic prompt (e.g., "A woman walks through a garden").</li>
                <li>Select a category of film effects, then choose specific effects to add to your prompt.</li>
                <li>Click "Add Selected Effect to Prompt" for each effect you want to include.</li>
                <li>Click "Generate Enhanced Prompt" to create your optimized prompt.</li>
                <li>Copy the enhanced prompt to use with Hailuo AI.</li>
              </ol>
              
              <h3 className="font-bold mt-6 mb-2">GENERATION TYPES:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Text-to-Video Basic:</strong> Simple video generation from text with basic film effects.</li>
                <li><strong>Text-to-Video Precise:</strong> Detailed video generation with specific cinematic qualities and effects.</li>
                <li><strong>Image-to-Video:</strong> Generate videos based on a reference image, defining how it should animate.</li>
                <li><strong>Subject Reference:</strong> Create videos featuring a specific subject from a reference image in new scenes.</li>
              </ul>
              
              <h3 className="font-bold mt-6 mb-2">WHY USE FILM EFFECTS:</h3>
              <p>Adding technical film terminology to your prompts helps Hailuo AI understand exactly how you want your video to look. A basic prompt like "A car driving on a highway" will work, but an enhanced prompt with specific film effects will produce much more cinematic and visually appealing results.</p>
              
              <h3 className="font-bold mt-6 mb-2">FOR BEST RESULTS, INCLUDE:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>A Main Subject (person, animal, object)</li>
                <li>A Scene (location, setting)</li>
                <li>Motion (action or movement)</li>
                <li>Camera Movement (how the camera moves)</li>
                <li>Aesthetic Atmosphere (visual style, lighting, mood)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmEffectsTranslator;
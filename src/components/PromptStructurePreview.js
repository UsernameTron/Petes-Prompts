import React from 'react';

const PromptStructurePreview = ({ 
  generationType, 
  structureInfo,
  templateExamples 
}) => {
  if (!structureInfo || !generationType || !templateExamples) {
    return null;
  }
  
  const examples = templateExamples[generationType] || [];
  const example = examples.length > 0 ? examples[0] : null;
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="font-medium text-gray-800 mb-3">Prompt Structure Guide</h3>
      
      <div className="space-y-4">
        {/* Structure elements */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Required Elements:</h4>
          <div className="space-y-2">
            {Object.entries(structureInfo).map(([element, description]) => {
              const isRequired = description.includes("Required");
              return (
                <div 
                  key={element}
                  className={`p-2 rounded-md text-sm ${
                    isRequired 
                      ? 'bg-red-50 border border-red-100' 
                      : 'bg-blue-50 border border-blue-100'
                  }`}
                >
                  <span className="font-medium">{element}:</span> {description}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Example */}
        {example && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Example:</h4>
            <div className="space-y-2">
              <div className="p-2 bg-white border border-gray-200 rounded-md text-sm">
                <span className="font-medium">Basic prompt:</span> {example.before}
              </div>
              <div className="p-2 bg-white border border-gray-200 rounded-md text-sm">
                <span className="font-medium">Enhanced prompt:</span> {example.after}
              </div>
              <div className="p-2 bg-white border border-gray-200 rounded-md text-sm">
                <span className="font-medium">Effects used:</span> {example.effects.join(", ")}
              </div>
            </div>
          </div>
        )}
        
        {/* Tips */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Start with a clear, concise description of the main subject and action</li>
            <li>Add specific details about the setting and environment</li>
            <li>Select film effects that complement the mood you want to create</li>
            <li>For best results, include at least one effect from each recommended category</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PromptStructurePreview;
import React from 'react';

const GenerationTypeSelector = ({ 
  generationTypes, 
  selectedType, 
  onSelectType,
  templateData
}) => {
  if (!generationTypes || !templateData) return null;
  
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Generation Type</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(generationTypes).map((typeKey) => {
          const type = templateData[typeKey];
          return (
            <div
              key={typeKey}
              className={`border rounded-lg p-4 cursor-pointer transition duration-150 ${
                selectedType === typeKey
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
              }`}
              onClick={() => onSelectType(typeKey)}
            >
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${type.iconBgColor} text-white mr-2`}>
                  {type.icon}
                </div>
                <h3 className="font-medium">{type.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{type.description}</p>
              
              <div className="text-xs">
                <div className="font-medium text-gray-700 mb-1">Recommended categories:</div>
                <div className="flex flex-wrap gap-1">
                  {type.recommendedCategories.map((category) => (
                    <span key={category} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenerationTypeSelector;
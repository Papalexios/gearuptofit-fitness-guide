
import React, { useState } from 'react';
import { analyzeRecipeUrl } from '../services/geminiService';
import { AnalyzedRecipe } from '../types';
import { LinkIcon, DnaIcon } from './icons';

const RecipeAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<AnalyzedRecipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
        setError('Please enter a valid recipe URL.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeRecipeUrl(url);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze recipe. Please check the URL or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <DnaIcon className="w-8 h-8 text-emerald-400" />
            Recipe DNA Analyzer
          </h2>
          <p className="text-gray-400 mt-2">Paste any recipe URL to get a complete macro breakdown.</p>
      </header>

      <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourfavoriterecipe.com/..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-600 disabled:bg-gray-500 transition-colors flex-shrink-0"
          >
            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <DnaIcon />}
            <span>Analyze</span>
          </button>
        </form>
      </div>

      {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>}
      
      {result && (
        <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50 animate-fade-in">
          <h3 className="text-2xl font-bold text-emerald-400">{result.recipeName}</h3>
          <p className="text-gray-400 mb-6">Serving Size: {result.servingSize}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
            <MacroPill label="Calories" value={result.macrosPerServing.calories} unit="kcal" color="bg-sky-500/20 text-sky-300"/>
            <MacroPill label="Protein" value={result.macrosPerServing.protein} unit="g" color="bg-emerald-500/20 text-emerald-300"/>
            <MacroPill label="Carbs" value={result.macrosPerServing.carbs} unit="g" color="bg-blue-500/20 text-blue-300"/>
            <MacroPill label="Fat" value={result.macrosPerServing.fat} unit="g" color="bg-amber-500/20 text-amber-300"/>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-300 mb-2">Key Ingredients</h4>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              {result.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const MacroPill: React.FC<{label: string; value: number; unit: string; color: string;}> = ({label, value, unit, color}) => (
    <div className={`p-4 rounded-lg ${color}`}>
        <p className="text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{unit}</p>
    </div>
)

export default RecipeAnalyzer;

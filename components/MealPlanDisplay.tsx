
import React, { useState } from 'react';
import { Meal, MealPlan, Macros } from '../types';
import { ZapIcon, StarIcon, ClipboardListIcon, ChevronDownIcon, UtensilsCrossedIcon } from './icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

interface MealPlanDisplayProps {
  mealPlan: MealPlan | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onShowGroceryList: () => void;
  onRateMeal: (mealName: string, rating: number) => void;
}

const MacroChart: React.FC<{ data: Macros }> = ({ data }) => {
    const chartData = [
        { name: 'Protein (g)', value: data.protein, fill: '#34d399' },
        { name: 'Carbs (g)', value: data.carbs, fill: '#3b82f6' },
        { name: 'Fat (g)', value: data.fat, fill: '#f59e0b' },
    ];

    return (
        <div className="relative w-full h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false}>
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-white">{data.calories}</span>
                <span className="text-sm text-gray-400">Total kcal</span>
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-gray-700/80 backdrop-blur-sm p-3 rounded-lg border border-gray-600">
                <p className="label text-white">{`${data.name} : ${data.value}g`}</p>
            </div>
        );
    }
    return null;
};

const MealCard: React.FC<{ meal: Meal, onRateMeal: (mealName: string, rating: number) => void }> = ({ meal, onRateMeal }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="bg-gray-800/60 rounded-xl border border-gray-700 transition-all duration-300">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 text-left flex justify-between items-center">
                <div>
                    <p className="text-sm text-emerald-400 font-medium">{meal.type}</p>
                    <h3 className="text-lg font-semibold text-white mt-1">{meal.name}</h3>
                </div>
                <div className="flex items-center space-x-4">
                    <p className="text-gray-400">{meal.macros.calories} kcal</p>
                    <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-700/50 animate-fade-in-up">
                    <h4 className="font-semibold text-gray-300 mb-2">Ingredients</h4>
                    <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
                        {meal.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                    </ul>
                    <h4 className="font-semibold text-gray-300 mb-2">Instructions</h4>
                    <p className="text-gray-400 mb-4">{meal.instructions}</p>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                             <p className="text-sm text-gray-400 mr-2">Rate this meal:</p>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => onRateMeal(meal.name, star)}>
                                    <StarIcon className={`w-6 h-6 transition-colors ${meal.rating && star <= meal.rating ? 'text-amber-400' : 'text-gray-600 hover:text-amber-300'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ mealPlan, isLoading, error, onGenerate, onShowGroceryList, onRateMeal }) => {
  if (isLoading && !mealPlan) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div><p className="ml-4 text-gray-300">Generating your plan...</p></div>;
  }

  if (error && !mealPlan) {
    return (
        <div className="text-center h-full flex flex-col items-center justify-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={onGenerate} className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-emerald-600">
                <ZapIcon />
                <span>Try Again</span>
            </button>
        </div>
    );
  }

  if (!mealPlan) {
    return (
        <div className="text-center h-full flex flex-col items-center justify-center">
            <UtensilsCrossedIcon className="w-24 h-24 text-gray-600 mb-4"/>
            <h2 className="text-2xl font-bold mb-2">No Meal Plan Generated</h2>
            <p className="text-gray-400 mb-6">Your personalized meal plan is being created!</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-3xl font-bold text-white">Your Daily Meal Plan</h2>
                <p className="text-gray-400">AI-generated plan for {mealPlan.day}.</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={onShowGroceryList} disabled={isLoading} className="bg-blue-500/80 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-600 disabled:bg-gray-500 transition-colors">
                    <ClipboardListIcon />
                    <span>Grocery List</span>
                </button>
                <button onClick={onGenerate} disabled={isLoading} className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-emerald-600 disabled:bg-gray-500 transition-colors">
                    {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <ZapIcon />}
                    <span>Regenerate</span>
                </button>
            </div>
        </header>

        {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>}
        
        <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">Total Daily Macros</h3>
            <MacroChart data={mealPlan.totalMacros} />
        </div>

        <div className="space-y-4">
            {mealPlan.meals.map((meal, i) => <MealCard key={meal.name + i} meal={meal} onRateMeal={onRateMeal}/>)}
        </div>
    </div>
  );
};


export default MealPlanDisplay;


import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, MealPlan } from '../types';
import * as geminiService from '../services/geminiService';
import MealPlanDisplay from './MealPlanDisplay';
import RecipeAnalyzer from './RecipeAnalyzer';
import BarcodeScanner from './BarcodeScanner';
import GroceryListModal from './GroceryListModal';
import { UtensilsCrossedIcon, BarcodeIcon, BookOpenIcon, SaladIcon } from './icons';

interface DashboardProps {
  userProfile: UserProfile;
  onResetProfile: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onResetProfile }) => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('plan');
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [groceryList, setGroceryList] = useState('');

  const handleGeneratePlan = useCallback(async (isRegeneration = false) => {
    setIsLoading(true);
    setError(null);
    if (!isRegeneration) {
        setMealPlan(null); // Clear old plan only on first generation
    }
    try {
      const plan = await geminiService.generateMealPlan(userProfile);
      setMealPlan(plan);
    } catch (err) {
      console.error(err);
      setError('Failed to generate meal plan. The AI might be busy. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);
  
  useEffect(() => {
    // Generate a plan on initial load if one doesn't exist
    if (!mealPlan) {
      handleGeneratePlan();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowGroceryList = async () => {
    if (!mealPlan) return;
    setIsLoading(true);
    try {
        const list = await geminiService.generateGroceryList(mealPlan);
        setGroceryList(list);
        setShowGroceryList(true);
    } catch (err) {
        setError('Could not generate grocery list.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const updateMealRating = (mealName: string, rating: number) => {
    if (!mealPlan) return;
    const updatedMeals = mealPlan.meals.map(m => m.name === mealName ? {...m, rating} : m);
    setMealPlan({...mealPlan, meals: updatedMeals});
    // In a real app, you would persist this rating and use it in the next generation prompt
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'plan':
        return <MealPlanDisplay mealPlan={mealPlan} isLoading={isLoading} error={error} onGenerate={() => handleGeneratePlan(true)} onShowGroceryList={handleShowGroceryList} onRateMeal={updateMealRating}/>;
      case 'analyze':
        return <RecipeAnalyzer />;
      case 'scan':
        return <BarcodeScanner />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-800/20 rounded-2xl overflow-hidden">
      <nav className="w-full md:w-64 bg-gray-800/50 border-b md:border-r md:border-b-0 border-gray-700/50 p-4 md:p-6 flex-shrink-0 flex flex-col">
        <div>
            <div className="flex items-center space-x-3 mb-10">
                <SaladIcon className="h-10 w-10 text-emerald-400"/>
                <div>
                    <h1 className="text-xl font-bold text-white">IntelliMacro AI</h1>
                    <p className="text-sm text-gray-400">Welcome, {userProfile.name}</p>
                </div>
            </div>

            <ul className="space-y-3">
            <NavItem icon={<UtensilsCrossedIcon/>} label="Meal Plan" active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} />
            <NavItem icon={<BookOpenIcon/>} label="Recipe Analyzer" active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')} />
            <NavItem icon={<BarcodeIcon/>} label="Barcode Scanner" active={activeTab === 'scan'} onClick={() => setActiveTab('scan')} />
            </ul>
        </div>
        <div className="mt-auto pt-10">
             <button
                onClick={onResetProfile}
                className="w-full text-center text-sm py-2 px-4 rounded-lg text-gray-400 hover:bg-red-800/50 hover:text-white transition-colors duration-200"
              >
                Reset Profile
              </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto min-h-[400px] md:min-h-[600px]">
        {renderContent()}
      </main>
      
      {showGroceryList && <GroceryListModal content={groceryList} onClose={() => setShowGroceryList(false)} />}
    </div>
  );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
    <li>
        <button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                active ? 'bg-emerald-500/20 text-emerald-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
        >
            <span className={active ? 'text-emerald-400' : ''}>{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    </li>
);

export default Dashboard;

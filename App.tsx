
import React, { useState } from 'react';
import {
  DumbbellIcon,
  RunningIcon,
  NutritionIcon,
  StarReviewIcon,
  CalculatorIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  SparklesIcon,
  HeartPulseIcon,
  RulerIcon,
  ActivityIcon,
  CheckCircleIcon,
  LightbulbIcon,
} from './components/icons';
import { calculateFitnessAge } from './services/geminiService';
import { FitnessProfile, FitnessAgeResult, UserProfile } from './types';
import UserProfileSetup from './components/UserProfileSetup';
import Dashboard from './components/Dashboard';


const featuredArticles = [
  {
    title: "From Couch to Your First 5K",
    url: "https://gearuptofit.com/running/from-couch-to-your-first-5k/",
    icon: <RunningIcon className="w-8 h-8 text-emerald-400" />,
    description: "A step-by-step guide for beginners to conquer their first race."
  },
  {
    title: "Biohack Your Way to Longevity",
    url: "https://gearuptofit.com/health/biohack-your-way-to-longevity/",
    icon: <DumbbellIcon className="w-8 h-8 text-emerald-400" />,
    description: "Discover secrets to a longer, healthier life through modern science."
  },
  {
    title: "The Ultimate Guide to HIIT Workout",
    url: "https://gearuptofit.com/fitness/the-ultimate-guide-to-hiit-workout/",
    icon: <DumbbellIcon className="w-8 h-8 text-emerald-400" />,
    description: "Maximize fat burn and improve endurance with high-intensity training."
  },
  {
    title: "Best Foods For Increasing Metabolism",
    url: "https://gearuptofit.com/nutrition/best-foods-for-increasing-metabolism/",
    icon: <NutritionIcon className="w-8 h-8 text-emerald-400" />,
    description: "Learn which foods can naturally boost your metabolic rate."
  },
];

const categories = [
  {
    title: "Running",
    description: "Training plans, gear reviews, and tips for runners of all levels.",
    url: "https://gearuptofit.com/running/running-for-weight-loss/",
    icon: <RunningIcon className="w-10 h-10 text-emerald-300" />
  },
  {
    title: "Nutrition",
    description: "Fuel your body with expert advice on diets, supplements, and meal planning.",
    url: "https://gearuptofit.com/nutrition/nutritional-planning/",
    icon: <NutritionIcon className="w-10 h-10 text-emerald-300" />
  },
  {
    title: "Fitness",
    description: "Workouts, exercises, and strategies to build strength and endurance.",
    url: "https://gearuptofit.com/fitness/how-different-types-of-training-transform-body-physique/",
    icon: <DumbbellIcon className="w-10 h-10 text-emerald-300" />
  },
  {
    title: "Gear Reviews",
    description: "In-depth reviews of the latest fitness trackers, shoes, and equipment.",
    url: "https://gearuptofit.com/review/best-fitness-trackers-2024/",
    icon: <StarReviewIcon className="w-10 h-10 text-emerald-300" />
  },
];

const tools = [
  {
    title: "TDEE Calculator",
    url: "https://gearuptofit.com/fitness-and-health-calculators/total-daily-energy-expenditure-calculation-tool/",
    description: "Calculate your Total Daily Energy Expenditure."
  },
  {
    title: "BMI & BMR Calculator",
    url: "https://gearuptofit.com/fitness-and-health-calculators/calculate-bmi-bmr-and-whr-now/",
    description: "Check your Body Mass Index and Basal Metabolic Rate."
  },
  {
    title: "Macronutrient Calculator",
    url: "https://gearuptofit.com/fitness-and-health-calculators/calculate-macronutrients-for-weight-loss/",
    description: "Determine your ideal macro intake for your goals."
  },
]

const AIFitnessCalculator: React.FC = () => {
    const [profile, setProfile] = useState<FitnessProfile>({
        age: 35,
        gender: 'Male',
        restingHeartRate: 65,
        height: 180,
        weight: 80,
        waist: 85,
        cardioMinutes: 150,
        strengthSessions: 2,
    });
    const [result, setResult] = useState<FitnessAgeResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: name === 'gender' ? value : Number(value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await calculateFitnessAge(profile);
            setResult(res);
        } catch (err) {
            console.error(err);
            setError('The AI is resting right now. Please try again in a moment.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setResult(null);
        setError(null);
    };

    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 md:p-8">
        <div className="text-center mb-8">
            <SparklesIcon className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">AI Fitness Age & Health Audit</h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Get a snapshot of your inner health. This AI tool analyzes your metrics to estimate your biological fitness age.</p>
        </div>

        {isLoading && <div className="flex justify-center items-center p-8"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div></div>}
        {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}

        {!isLoading && !result && (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputWithIcon icon={<HeartPulseIcon/>} label="Age" name="age" type="number" value={profile.age.toString()} onChange={handleChange} />
                <SelectWithIcon icon={<DumbbellIcon/>} label="Gender" name="gender" value={profile.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
                <InputWithIcon icon={<HeartPulseIcon/>} label="Resting HR (bpm)" name="restingHeartRate" type="number" value={profile.restingHeartRate.toString()} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <InputWithIcon icon={<RulerIcon/>} label="Height (cm)" name="height" type="number" value={profile.height.toString()} onChange={handleChange} />
                 <InputWithIcon icon={<DumbbellIcon/>} label="Weight (kg)" name="weight" type="number" value={profile.weight.toString()} onChange={handleChange} />
                 <InputWithIcon icon={<RulerIcon/>} label="Waist (cm)" name="waist" type="number" value={profile.waist.toString()} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWithIcon icon={<ActivityIcon/>} label="Weekly Cardio (mins)" name="cardioMinutes" type="number" value={profile.cardioMinutes.toString()} onChange={handleChange} />
                <InputWithIcon icon={<ActivityIcon/>} label="Weekly Strength (days)" name="strengthSessions" type="number" value={profile.strengthSessions.toString()} onChange={handleChange} />
              </div>

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-emerald-500/20 text-lg flex items-center justify-center gap-2">
                <SparklesIcon/> Calculate My Fitness Age
              </button>
            </form>
        )}

        {result && !isLoading && (
            <div className="max-w-4xl mx-auto animate-fade-in-up space-y-8">
                <div className="text-center">
                    <p className="text-gray-400">Your Estimated Fitness Age is</p>
                    <p className="text-7xl md:text-8xl font-extrabold gradient-text my-2">{result.fitnessAge}</p>
                    <p className="text-gray-400">Chronological Age: {profile.age}</p>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                    <p className="text-white text-center">{result.analysis}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-lg text-emerald-400 flex items-center gap-2 mb-3"><CheckCircleIcon/> Strengths</h4>
                        <ul className="space-y-2">
                            {result.strengths.map((s, i) => <li key={i} className="bg-gray-800/50 p-3 rounded-md text-gray-300">{s}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-bold text-lg text-amber-400 flex items-center gap-2 mb-3"><LightbulbIcon/> Areas for Improvement</h4>
                        <ul className="space-y-2">
                             {result.areasForImprovement.map((s, i) => <li key={i} className="bg-gray-800/50 p-3 rounded-md text-gray-300">{s}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="text-center bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                    <p className="font-bold text-lg text-white">Estimated VO2 Max</p>
                    <p className="text-4xl font-bold text-emerald-400">{result.vo2MaxEstimate.toFixed(1)}</p>
                    <p className="text-xs text-gray-500 mt-2">{result.disclaimer}</p>
                </div>

                 <button onClick={handleReset} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                    Calculate Again
                </button>
            </div>
        )}

      </div>
    );
};

const InputWithIcon: React.FC<{icon: React.ReactNode, label: string, name: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({icon, label, name, type, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
            <input type={type} name={name} value={value} onChange={onChange} required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"/>
        </div>
    </div>
);
const SelectWithIcon: React.FC<{icon: React.ReactNode, label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[]}> = ({icon, label, name, value, onChange, options}) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
            <select name={name} value={value} onChange={onChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition appearance-none">
                {options.map(opt => <option key={opt}>{opt}</option>)}
            </select>
        </div>
    </div>
);

const IntelliMacroPlanner: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const handleSaveProfile = (profile: UserProfile) => {
        setUserProfile(profile);
    };

    const handleResetProfile = () => {
        setUserProfile(null);
    }

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl">
            {userProfile ? (
                <Dashboard userProfile={userProfile} onResetProfile={handleResetProfile} />
            ) : (
                <UserProfileSetup onSave={handleSaveProfile} />
            )}
        </div>
    );
};


const App: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <main className="px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-gray-800/50 [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
          <div className="relative z-10 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
              Unlock Your <span className="gradient-text">Peak Performance</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-400">
              Expert advice, in-depth reviews, and proven workout plans from <a href="https://gearuptofit.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-semibold">gearuptofit.com</a>.
            </p>
            <a
              href="https://gearuptofit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-emerald-500/20"
            >
              Explore GearUpToFit.com <ArrowRightIcon className="w-5 h-5" />
            </a>
          </div>
        </section>

        {/* Featured Articles Section */}
        <section id="featured" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Articles</h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Hand-picked guides and reviews to kickstart your fitness journey.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredArticles.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col items-start gap-4 hover:border-emerald-500/50 hover:bg-gray-800 transition-all group"
                >
                  {article.icon}
                  <h3 className="text-xl font-semibold text-white">{article.title}</h3>
                  <p className="text-gray-400 flex-grow">{article.description}</p>
                  <span className="flex items-center gap-2 text-emerald-400 font-semibold group-hover:underline">
                    Read Article <ExternalLinkIcon className="w-4 h-4" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
        
        {/* AI Fitness Calculator Section */}
        <section id="ai-calculator" className="py-16 md:py-24">
            <div className="max-w-5xl mx-auto">
                <AIFitnessCalculator />
            </div>
        </section>

        {/* IntelliMacro AI Section */}
        <section id="intellimacro" className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
                 <div className="text-center mb-12">
                    <SparklesIcon className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">IntelliMacro AI Meal Planner</h2>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Create your profile and get a personalized, macro-tracked meal plan generated by AI in seconds. Perfect for achieving your weight loss, maintenance, or muscle gain goals.</p>
                </div>
                <IntelliMacroPlanner />
            </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-16 md:py-24 bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Browse by Category</h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Find exactly what you need, from running guides to nutritional advice.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category, index) => (
                <a
                  key={index}
                  href={category.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 flex items-center gap-6 hover:border-emerald-500/50 hover:bg-gray-800 transition-all group"
                >
                  <div className="flex-shrink-0 bg-gray-700/50 p-4 rounded-full">{category.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                    <p className="mt-2 text-gray-400">{category.description}</p>
                  </div>
                  <ArrowRightIcon className="w-6 h-6 text-gray-500 ml-auto flex-shrink-0 transform transition-transform group-hover:translate-x-1 group-hover:text-emerald-400" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Other Tools Section */}
        <section id="tools" className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
               <CalculatorIcon className="w-12 h-12 text-emerald-400 mx-auto" />
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">More Calculators & Tools</h2>
              <p className="mt-4 text-gray-400">Visit our main site for a full suite of fitness calculation tools.</p>
            </div>
            <div className="space-y-4">
               {tools.map((tool, index) => (
                 <a key={index} href={tool.url} target="_blank" rel="noopener noreferrer" className="block bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-emerald-500/50 hover:bg-gray-800 transition-all group">
                   <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
                        <p className="text-gray-400 text-sm">{tool.description}</p>
                      </div>
                      <ExternalLinkIcon className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                   </div>
                 </a>
               ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-white">Ready to Gear Up?</h3>
            <p className="mt-2 text-gray-400">Visit our full website for hundreds of articles, guides, and tools.</p>
             <a
              href="https://gearuptofit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
              Visit GearUpToFit.com
            </a>
            <p className="mt-8 text-sm text-gray-500">&copy; {new Date().getFullYear()} GearUpToFit.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

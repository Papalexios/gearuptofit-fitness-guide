
export interface FitnessProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  restingHeartRate: number;
  height: number; // in cm
  weight: number; // in kg
  waist: number; // in cm
  cardioMinutes: number;
  strengthSessions: number;
}

export interface FitnessAgeResult {
    fitnessAge: number;
    analysis: string;
    strengths: string[];
    areasForImprovement: string[];
    vo2MaxEstimate: number;
    disclaimer: string;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'Male' | 'Female' | 'Other';
  activityLevel: 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active';
  goal: 'Lose Weight' | 'Maintain Weight' | 'Gain Muscle';
  preferences: string; // e.g., vegan, gluten-free
  allergies: string; // e.g., peanuts, shellfish
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  macros: Macros;
  ingredients: string[];
  instructions: string;
  rating?: number;
}

export interface MealPlan {
  day: string;
  totalMacros: Macros;
  meals: Meal[];
}

export interface AnalyzedRecipe {
  recipeName: string;
  servingSize: string;
  macrosPerServing: Macros;
  ingredients: string[];
}

export interface ScannedProduct {
  productName: string;
  servingSize: string;
  servingsPerContainer: number;
  macrosPerServing: Macros;
  ingredients: string[];
}

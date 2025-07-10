
import { GoogleGenAI, Type } from "@google/genai";
import { FitnessProfile, FitnessAgeResult, UserProfile, MealPlan, AnalyzedRecipe, ScannedProduct, Macros, Meal } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const fitnessAgeSchema = {
  type: Type.OBJECT,
  properties: {
    fitnessAge: { type: Type.INTEGER, description: "The user's calculated fitness age as an integer." },
    analysis: { type: Type.STRING, description: "A concise, one-paragraph analysis of the user's fitness age and what it means." },
    strengths: {
      type: Type.ARRAY,
      description: "An array of 2-3 strings highlighting the user's positive health and fitness metrics.",
      items: { type: Type.STRING }
    },
    areasForImprovement: {
      type: Type.ARRAY,
      description: "An array of 2-3 strings providing actionable advice for areas where the user can improve.",
      items: { type: Type.STRING }
    },
    vo2MaxEstimate: { type: Type.NUMBER, description: "A reasonable estimate of the user's VO2 Max based on their provided data." },
    disclaimer: { type: Type.STRING, description: "A standard disclaimer that this is an estimate and not a medical diagnosis."}
  },
  required: ['fitnessAge', 'analysis', 'strengths', 'areasForImprovement', 'vo2MaxEstimate', 'disclaimer']
};

export const calculateFitnessAge = async (profile: FitnessProfile): Promise<FitnessAgeResult> => {
  const prompt = `
    You are a friendly and encouraging AI Health & Fitness expert named 'FitBot'.
    Based on the following user data, calculate their 'Fitness Age' and provide a concise, positive, and actionable health audit.

    User Data:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Resting Heart Rate: ${profile.restingHeartRate} bpm
    - Height: ${profile.height} cm
    - Weight: ${profile.weight} kg
    - Waist Circumference: ${profile.waist} cm
    - Weekly Cardio: ${profile.cardioMinutes} minutes
    - Weekly Strength Sessions: ${profile.strengthSessions} sessions

    Your analysis should consider factors like BMI, waist-to-height ratio, resting heart rate against age-based norms, and adherence to recommended physical activity guidelines (e.g., 150 mins of moderate cardio).

    **Fitness Age Calculation:**
    - Start with the user's chronological age.
    - Adjust downwards for positive factors (e.g., low resting heart rate, healthy BMI, meeting exercise goals).
    - Adjust upwards for negative factors (e.g., high resting heart rate, high waist-to-height ratio, sedentary lifestyle).
    - The final result should be a plausible integer.

    **VO2 Max Estimation:**
    - Provide a rough estimate of their VO2 Max based on their age, gender, and activity level.

    **Response Format:**
    Return a single, valid JSON object matching the provided schema. Do not include any text outside of the JSON object. Your tone must be motivating, not alarming. Frame "weaknesses" as "areas for improvement." Always include the disclaimer: "This is an estimate for informational purposes and is not a substitute for professional medical advice."
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: fitnessAgeSchema,
    },
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as FitnessAgeResult;
  } catch (e) {
    console.error("Failed to parse AI response:", jsonText);
    throw new Error("Received an invalid response from the AI.");
  }
};

const macrosSchema = {
    type: Type.OBJECT,
    properties: {
        calories: { type: Type.INTEGER },
        protein: { type: Type.INTEGER },
        carbs: { type: Type.INTEGER },
        fat: { type: Type.INTEGER },
    },
    required: ['calories', 'protein', 'carbs', 'fat']
};

const mealSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
        name: { type: Type.STRING },
        macros: macrosSchema,
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        instructions: { type: Type.STRING },
    },
    required: ['type', 'name', 'macros', 'ingredients', 'instructions']
};

const mealPlanSchema = {
    type: Type.OBJECT,
    properties: {
        day: { type: Type.STRING, description: "The day of the week, e.g., 'Monday'."},
        totalMacros: macrosSchema,
        meals: {
            type: Type.ARRAY,
            items: mealSchema
        }
    },
    required: ['day', 'totalMacros', 'meals']
};

export const generateMealPlan = async (profile: UserProfile): Promise<MealPlan> => {
    const prompt = `
        You are an expert nutritionist and chef AI called IntelliMacro. Create a one-day meal plan for the following user.
        
        User Profile:
        - Name: ${profile.name}
        - Age: ${profile.age}
        - Weight: ${profile.weight} kg
        - Height: ${profile.height} cm
        - Gender: ${profile.gender}
        - Activity Level: ${profile.activityLevel}
        - Primary Goal: ${profile.goal}
        - Dietary Preferences: ${profile.preferences || 'None'}
        - Allergies or Dislikes: ${profile.allergies || 'None'}

        Instructions:
        1. Calculate the user's estimated daily calorie and macronutrient needs based on their profile and goals (using Harris-Benedict or a similar formula).
        2. Create a full day's meal plan (Breakfast, Lunch, Dinner, and one Snack).
        3. The meals should be healthy, balanced, and delicious. Provide simple ingredients and clear instructions.
        4. Ensure the total calories and macros for the day closely match the calculated needs.
        5. Adhere strictly to the user's preferences and allergies.
        6. Return the response as a single, valid JSON object matching the provided schema. Do not include any text outside the JSON object.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: mealPlanSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as MealPlan;
    } catch (e) {
        console.error("Failed to parse AI response for meal plan:", jsonText);
        throw new Error("Received an invalid response from the AI.");
    }
};

export const generateGroceryList = async (mealPlan: MealPlan): Promise<string> => {
    const prompt = `
        You are a helpful kitchen assistant AI. Based on the following meal plan JSON, create a simple, well-organized grocery list in Markdown format.
        
        Meal Plan:
        ${JSON.stringify(mealPlan, null, 2)}

        Instructions:
        1. Consolidate all ingredients from all meals into a single list.
        2. Categorize the list by common grocery store sections (e.g., ### Produce, ### Protein, ### Dairy & Alternatives, ### Pantry, ### Spices).
        3. Format each item as a markdown list item (e.g., "* 1 cup quinoa").
        4. Return only the markdown text. Do not include any other commentary.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });

    return response.text;
};

const analyzedRecipeSchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: { type: Type.STRING },
        servingSize: { type: Type.STRING },
        macrosPerServing: macrosSchema,
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['recipeName', 'servingSize', 'macrosPerServing', 'ingredients']
};

export const analyzeRecipeUrl = async (url: string): Promise<AnalyzedRecipe> => {
    const prompt = `
        You are a recipe analysis AI. A user has provided a URL to a recipe. Your task is to extract the recipe's name, determine a reasonable serving size, list the key ingredients, and estimate the macronutrients (calories, protein, carbs, fat) per serving.

        Recipe URL: ${url}

        Instructions:
        1.  Act as if you have visited the URL. Based on the URL, infer the likely recipe.
        2.  Provide a nutritional analysis for that recipe.
        3.  Return the response as a single, valid JSON object matching the provided schema. Do not include any text outside the JSON object. If you cannot analyze the URL, create a plausible analysis for a typical recipe of that kind.
    `;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analyzedRecipeSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as AnalyzedRecipe;
    } catch (e) {
        console.error("Failed to parse AI response for recipe analysis:", jsonText);
        throw new Error("Received an invalid response from the AI.");
    }
};

const scannedProductSchema = {
    type: Type.OBJECT,
    properties: {
        productName: { type: Type.STRING },
        servingSize: { type: Type.STRING },
        servingsPerContainer: { type: Type.NUMBER },
        macrosPerServing: macrosSchema,
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['productName', 'servingSize', 'servingsPerContainer', 'macrosPerServing', 'ingredients']
};

export const getNutritionFromBarcode = async (): Promise<ScannedProduct> => {
    // This is a simulation. In a real app, you would use a barcode to look up a product.
    // Here, we ask the AI to generate a plausible product.
    const prompt = `
        You are a food database AI. For a simulation, generate a plausible nutritional profile for a common grocery item that a user might scan with a barcode scanner.
        
        Instructions:
        1. Invent a common, healthy-ish food product (e.g., "Organic Almond Butter", "Greek Yogurt, Plain", "Whole Wheat Bread").
        2. Create a realistic nutrition label for it, including serving size, servings per container, macros, and ingredients.
        3. Return the response as a single, valid JSON object matching the provided schema. Do not include any text outside the JSON object.
    `;
    
     const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: scannedProductSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as ScannedProduct;
    } catch (e)        {
        console.error("Failed to parse AI response for scanned product:", jsonText);
        throw new Error("Received an invalid response from the AI.");
    }
};

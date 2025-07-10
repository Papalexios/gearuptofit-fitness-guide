
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { SparklesIcon } from './icons';

interface UserProfileSetupProps {
  onSave: (profile: UserProfile) => void;
}

const UserProfileSetup: React.FC<UserProfileSetupProps> = ({ onSave }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 30,
    weight: 70,
    height: 175,
    gender: 'Male',
    activityLevel: 'Moderate',
    goal: 'Maintain Weight',
    preferences: '',
    allergies: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = ['age', 'weight', 'height'].includes(name);
    setProfile(prev => ({
        ...prev,
        [name]: isNumber ? (value ? parseInt(value, 10) : 0) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-8">
      <div className="text-center mb-8">
        <SparklesIcon className="mx-auto h-12 w-12 text-emerald-400" />
        <h1 className="text-3xl font-bold text-white mt-4">Create Your Profile</h1>
        <p className="text-gray-400 mt-2">Let's personalize your meal plans.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Name" name="name" value={profile.name} onChange={handleChange} required />
          <InputField label="Age" name="age" type="number" value={profile.age.toString()} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Weight (kg)" name="weight" type="number" value={profile.weight.toString()} onChange={handleChange} />
          <InputField label="Height (cm)" name="height" type="number" value={profile.height.toString()} onChange={handleChange} />
          <SelectField label="Gender" name="gender" value={profile.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Activity Level"
            name="activityLevel"
            value={profile.activityLevel}
            onChange={handleChange}
            options={['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active']}
          />
          <SelectField
            label="Primary Goal"
            name="goal"
            value={profile.goal}
            onChange={handleChange}
            options={['Lose Weight', 'Maintain Weight', 'Gain Muscle']}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Dietary Preferences</label>
          <textarea
              name="preferences"
              value={profile.preferences}
              onChange={handleChange}
              placeholder="e.g., Vegan, low-carb, no red meat"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              rows={2}
            />
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Allergies or Dislikes</label>
          <textarea
              name="allergies"
              value={profile.allergies}
              onChange={handleChange}
              placeholder="e.g., Peanuts, shellfish, cilantro"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              rows={2}
            />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          Create My AI Profile
        </button>
      </form>
    </div>
  );
};

// Helper components for form fields
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type = 'text', value, onChange, required=false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
    />
  </div>
);

interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <select
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition appearance-none"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
)

export default UserProfileSetup;

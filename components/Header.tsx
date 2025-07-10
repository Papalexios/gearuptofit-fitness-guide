
import React from 'react';
import { UserProfile } from '../types';
import { SaladIcon } from './icons';

interface HeaderProps {
  userProfile: UserProfile;
  onResetProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userProfile, onResetProfile }) => {
  return (
    <header className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700 p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <SaladIcon className="h-8 w-8 text-emerald-400" />
        <h1 className="text-xl font-bold text-white">IntelliMacro AI</h1>
      </div>
      <div className="flex items-center space-x-4">
        <p className="text-gray-300 hidden sm:block">
          Welcome, <span className="font-semibold">{userProfile.name}</span>
        </p>
        <button
          onClick={onResetProfile}
          className="text-sm py-2 px-4 rounded-lg bg-red-800/50 text-red-300 hover:bg-red-800 hover:text-white transition-colors"
        >
          Reset Profile
        </button>
      </div>
    </header>
  );
};

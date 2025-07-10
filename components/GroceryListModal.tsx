
import React from 'react';
import { XIcon } from './icons';

interface GroceryListModalProps {
  content: string;
  onClose: () => void;
}

const GroceryListModal: React.FC<GroceryListModalProps> = ({ content, onClose }) => {
  // A simple markdown to HTML converter for display
  const formatContent = (text: string) => {
    const listItems: { [key: string]: string[] } = {};
    let currentCategory = 'Uncategorized';

    text.split('\n').forEach(line => {
      line = line.trim();
      if (line.startsWith('###')) {
        currentCategory = line.replace('###', '').trim();
        if (!listItems[currentCategory]) {
          listItems[currentCategory] = [];
        }
      } else if (line.startsWith('*')) {
        if (!listItems[currentCategory]) {
          listItems[currentCategory] = [];
        }
        listItems[currentCategory].push(line.replace('*', '').trim());
      }
    });

    let html = '';
    for (const category in listItems) {
      if (listItems[category].length > 0) {
        html += `<h3 class="text-xl font-semibold text-emerald-400 mt-4 mb-2">${category}</h3>`;
        html += '<ul class="space-y-2">';
        listItems[category].forEach(item => {
          html += `<li class="text-gray-300 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-emerald-400">${item}</li>`;
        });
        html += '</ul>';
      }
    }
    return html;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="p-4 flex justify-between items-center border-b border-gray-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Your Grocery List</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <div 
          className="p-6 overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }} 
        />
        <footer className="p-4 border-t border-gray-700 flex-shrink-0 bg-gray-800/50 rounded-b-2xl">
             <button
                onClick={onClose}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
        </footer>
      </div>
    </div>
  );
};

export default GroceryListModal;

import React from 'react';
import LCDDisplay from './components/LCDDisplay';
import { Github } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow">
        <LCDDisplay />
      </div>
      <div className="bg-gray-800 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm">
        <span>Made by Barbatoss</span>
        <a 
          href="https://github.com/Barbatoss" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-white transition-colors"
        >
          <Github size={16} />
        </a>
      </div>
    </div>
  );
}

export default App;
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-tyrian-purple-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-tyrian-gray-medium mb-8">
          The page you're looking for doesn't exist yet. This is a placeholder for future content.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-6 py-3 bg-tyrian-gradient rounded-lg font-bold text-white hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;

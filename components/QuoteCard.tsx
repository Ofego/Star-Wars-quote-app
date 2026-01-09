import React from 'react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
  isFading: boolean;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isFading }) => {
  return (
    <div 
      className={`max-w-4xl w-full px-6 md:px-12 py-10 text-center transition-all duration-700 ease-in-out transform ${
        isFading ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
      }`}
    >
      <div className="mb-8">
        <h1 className="font-cinzel text-3xl md:text-5xl lg:text-6xl text-white leading-tight tracking-wide drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
          "{quote.text}"
        </h1>
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-2 mt-8">
        <div className="h-px w-24 bg-sw-yellow opacity-60 mb-4"></div>
        <p className="font-montserrat text-sw-yellow text-xl md:text-2xl font-bold tracking-widest uppercase">
          {quote.character}
        </p>
        <p className="font-montserrat text-gray-400 text-sm md:text-base italic tracking-wider">
          {quote.source}
        </p>
      </div>
    </div>
  );
};

export default QuoteCard;
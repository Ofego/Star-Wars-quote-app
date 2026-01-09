import React, { useState, useEffect, useCallback } from 'react';
import { Quote } from './types';
import { QUOTES } from './constants';
import StarField from './components/StarField';
import QuoteCard from './components/QuoteCard';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from './utils/sound';

const App: React.FC = () => {
  // Initialize with a random quote
  const [currentQuote, setCurrentQuote] = useState<Quote>(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    return QUOTES[randomIndex];
  });
  
  const [isFading, setIsFading] = useState<boolean>(false);
  const [isButtonHovered, setIsButtonHovered] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuteState());

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const generateNewQuote = useCallback(() => {
    if (isFading) return;

    soundManager.playClick();
    setIsFading(true);

    // Timing to match CSS transitions
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * QUOTES.length);
      } while (QUOTES[newIndex].id === currentQuote.id);

      setCurrentQuote(QUOTES[newIndex]);
      setIsFading(false);
      
      // Play reveal sound slightly after text starts appearing
      setTimeout(() => soundManager.playReveal(), 100);
    }, 600); // 600ms buffer for fade out
  }, [currentQuote.id, isFading]);

  // Handle keyboard interaction (Spacebar to generate)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault(); // Prevent scrolling
        generateNewQuote();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateNewQuote]);

  // Determine button glow color based on faction
  const getGlowColor = () => {
    if (currentQuote.faction === 'sith') return 'shadow-[0_0_20px_#EB212E] border-saber-red';
    if (currentQuote.faction === 'jedi') return 'shadow-[0_0_20px_#2E67F8] border-saber-blue';
    return 'shadow-[0_0_20px_#FFE81F] border-sw-yellow';
  };

  const getButtonTextColor = () => {
    if (currentQuote.faction === 'sith') return 'text-red-400 group-hover:text-red-100';
    if (currentQuote.faction === 'jedi') return 'text-blue-400 group-hover:text-blue-100';
    return 'text-yellow-400 group-hover:text-yellow-100';
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-sw-yellow selection:text-black">
      {/* Background */}
      <StarField />
      
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      {/* Sound Toggle */}
      <button 
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 text-gray-500 hover:text-sw-yellow transition-colors duration-300 p-2 rounded-full border border-transparent hover:border-gray-800 bg-black/30 backdrop-blur-sm"
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full min-h-[60vh] p-4">
        
        <QuoteCard quote={currentQuote} isFading={isFading} />

        {/* Action Area */}
        <div className={`mt-16 transition-opacity duration-700 ${isFading ? 'opacity-50' : 'opacity-100'}`}>
          <button
            onClick={generateNewQuote}
            onMouseEnter={() => {
              setIsButtonHovered(true);
              soundManager.playHover();
            }}
            onMouseLeave={() => setIsButtonHovered(false)}
            className={`
              group relative px-8 py-4 bg-transparent border-2 rounded-lg 
              font-cinzel text-lg md:text-xl font-bold tracking-widest uppercase
              transition-all duration-300 ease-out
              ${isButtonHovered ? getGlowColor() : 'border-gray-600 shadow-none'}
            `}
          >
            {/* Button Inner Text with Glow Effect */}
            <span className={`flex items-center gap-3 transition-colors duration-300 ${getButtonTextColor()}`}>
              <Sparkles className={`w-5 h-5 ${isButtonHovered ? 'animate-pulse' : ''}`} />
              <span>New Quote</span>
              <Sparkles className={`w-5 h-5 ${isButtonHovered ? 'animate-pulse' : ''}`} />
            </span>

            {/* Subtle light reflection on button surface */}
            <div className={`absolute inset-0 bg-white opacity-0 transition-opacity duration-300 rounded-md ${isButtonHovered ? 'opacity-5' : ''}`} />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 text-gray-600 font-montserrat text-xs tracking-widest uppercase opacity-60">
        Press Spacebar for Wisdom
      </footer>
    </div>
  );
};

export default App;
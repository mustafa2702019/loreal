import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Send, Wand2, Shirt, User, MessageSquare } from 'lucide-react';
import type { PageType } from '../App';
import { useApp } from '../context/AppContext';

interface AIDesignerPromptPageProps {
  onNavigate: (page: PageType) => void;
}

interface SuggestionChip {
  icon: React.ReactNode;
  text: string;
}

const suggestionChips: SuggestionChip[] = [
  { icon: <Shirt size={14} />, text: 'For my navy suit' },
  { icon: <User size={14} />, text: 'Romantic date night' },
  { icon: <MessageSquare size={14} />, text: 'Fresh morning scent' },
  { icon: <Sparkles size={14} />, text: 'Special occasion' },
];

export default function AIDesignerPromptPage({ onNavigate }: AIDesignerPromptPageProps) {
  const [prompt, setPrompt] = useState('');
  const [, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { setCurrentBlend, setAiSuggestion } = useApp();

  const generateRandomBlend = useCallback(() => {
    // Generate random values that sum to 100 with max 3 non-zero bases
    const bases = ['floral', 'woody', 'citrus', 'musk', 'oriental'] as const;
    
    // Shuffle and pick 2-3 bases
    const shuffled = [...bases].sort(() => Math.random() - 0.5);
    const numBases = Math.floor(Math.random() * 2) + 2; // 2 or 3 bases
    const selectedBases = shuffled.slice(0, numBases);
    
    // Generate random percentages
    let remaining = 100;
    const blend: Record<string, number> = {
      floral: 0,
      woody: 0,
      citrus: 0,
      musk: 0,
      oriental: 0,
    };
    
    selectedBases.forEach((base, index) => {
      if (index === selectedBases.length - 1) {
        blend[base] = remaining;
      } else {
        const max = remaining - (selectedBases.length - index - 1) * 10;
        const min = 20;
        const value = Math.floor(Math.random() * (max - min + 1)) + min;
        // Round to nearest 5
        blend[base] = Math.round(value / 5) * 5;
        remaining -= blend[base];
      }
    });
    
    return blend;
  }, []);

  const handleSubmit = useCallback(() => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setShowAnalysis(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      const blend = generateRandomBlend();
      
      setCurrentBlend({
        id: 'current',
        name: 'AI Generated',
        floral: blend.floral,
        woody: blend.woody,
        citrus: blend.citrus,
        musk: blend.musk,
        oriental: blend.oriental,
      });
      
      setAiSuggestion(`Based on "${prompt}", I've created a unique blend for you.`);
      setIsGenerating(false);
      
      // Navigate to mixing lab after showing result
      setTimeout(() => {
        onNavigate('mixing-lab');
      }, 2000);
    }, 2500);
  }, [prompt, generateRandomBlend, setCurrentBlend, setAiSuggestion, onNavigate]);

  const handleChipClick = useCallback((text: string) => {
    setPrompt(text);
  }, []);

  return (
    <div className="min-h-screen p-5">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-white/80" />
        </motion.button>
        
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-amber-300/80" />
          <span className="text-white/80 text-sm tracking-widest uppercase">AI Designer</span>
        </div>
        
        <div className="w-10" />
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!showAnalysis ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-serif text-white text-center mb-2"
            >
              What fragrance do you desire?
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-sm text-center mb-10"
            >
              Describe the occasion, your outfit, or your mood
            </motion.p>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full glass rounded-2xl p-1 mb-6"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A scent for my black velvet dress..."
                  className="flex-1 bg-transparent px-4 py-4 text-white placeholder-white/30 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300/80 to-amber-400/60 flex items-center justify-center disabled:opacity-30"
                >
                  <Send size={20} className="text-slate-900" />
                </motion.button>
              </div>
            </motion.div>

            {/* Suggestion Chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {suggestionChips.map((chip, index) => (
                <motion.button
                  key={chip.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChipClick(chip.text)}
                  className="glass px-4 py-2 rounded-full flex items-center gap-2 text-white/60 hover:text-white/80 hover:bg-white/5 transition-all"
                >
                  {chip.icon}
                  <span className="text-sm">{chip.text}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Alternative Options */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('ai-analyzer')}
                className="glass px-5 py-3 rounded-xl flex items-center gap-2 text-white/60 hover:text-white/80"
              >
                <Shirt size={16} />
                <span className="text-sm">Analyze Outfit</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('mood-map')}
                className="glass px-5 py-3 rounded-xl flex items-center gap-2 text-white/60 hover:text-white/80"
              >
                <Wand2 size={16} />
                <span className="text-sm">By Mood</span>
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh]"
          >
            {/* AI Thinking Animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="relative w-24 h-24 mb-8"
            >
              <div className="absolute inset-0 rounded-full border border-amber-300/20" />
              <div className="absolute inset-2 rounded-full border border-amber-300/30" />
              <div className="absolute inset-4 rounded-full border border-amber-300/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={32} className="text-amber-300/80" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-serif text-white mb-2"
            >
              Crafting your fragrance
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/40 text-sm"
            >
              Analyzing: "{prompt}"
            </motion.p>

            {/* Progress dots */}
            <div className="flex gap-2 mt-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: i * 0.2 
                  }}
                  className="w-2 h-2 rounded-full bg-amber-300/60"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

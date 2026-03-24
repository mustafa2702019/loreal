import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Diamond, Zap, Heart, Sun, Mic, Sparkles, Check } from 'lucide-react';
import type { PageType } from '../App';
import { useApp } from '../context/AppContext';

interface MoodMapPageProps {
  onNavigate: (page: PageType) => void;
}

interface Mood {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  blend: { floral: number; woody: number; citrus: number; musk: number; oriental: number };
}

const moods: Mood[] = [
  {
    id: 'sophisticated',
    name: 'Sophisticated',
    subtitle: 'Amber & Oud',
    icon: <Diamond size={28} />,
    color: '#a855f7',
    blend: { floral: 15, woody: 35, citrus: 10, musk: 25, oriental: 15 },
  },
  {
    id: 'energetic',
    name: 'Energetic',
    subtitle: 'Citrus & Mint',
    icon: <Zap size={28} />,
    color: '#eab308',
    blend: { floral: 20, woody: 10, citrus: 50, musk: 10, oriental: 10 },
  },
  {
    id: 'romantic',
    name: 'Romantic',
    subtitle: 'Rose & Vanilla',
    icon: <Heart size={28} />,
    color: '#ec4899',
    blend: { floral: 45, woody: 15, citrus: 10, musk: 20, oriental: 10 },
  },
  {
    id: 'playful',
    name: 'Playful',
    subtitle: 'Fruity & Floral',
    icon: <Sun size={28} />,
    color: '#f97316',
    blend: { floral: 35, woody: 10, citrus: 30, musk: 15, oriental: 10 },
  },
];

// Generate random blend based on voice input
const generateVoiceBlend = (input: string) => {
  const keywords: Record<string, Partial<Mood['blend']>> = {
    'fresh': { citrus: 45, floral: 25, musk: 20, woody: 10 },
    'morning': { citrus: 40, floral: 30, musk: 20, woody: 10 },
    'evening': { oriental: 35, woody: 30, musk: 25, floral: 10 },
    'night': { musk: 40, oriental: 30, woody: 20, floral: 10 },
    'date': { floral: 40, musk: 30, oriental: 20, woody: 10 },
    'work': { citrus: 35, woody: 25, musk: 25, floral: 15 },
    'elegant': { floral: 30, woody: 30, musk: 25, oriental: 15 },
    'casual': { citrus: 35, floral: 25, musk: 25, woody: 15 },
    'strong': { oriental: 40, woody: 35, musk: 20, floral: 5 },
    'light': { citrus: 45, floral: 35, musk: 15, woody: 5 },
    'sweet': { floral: 45, musk: 30, oriental: 15, citrus: 10 },
    'woody': { woody: 50, oriental: 25, musk: 20, floral: 5 },
  };
  
  const lowerInput = input.toLowerCase();
  let blend: Mood['blend'] = { floral: 20, woody: 20, citrus: 20, musk: 20, oriental: 20 };
  
  for (const [keyword, values] of Object.entries(keywords)) {
    if (lowerInput.includes(keyword)) {
      blend = { ...blend, ...values };
      break;
    }
  }
  
  // Add some randomness
  const bases: (keyof Mood['blend'])[] = ['floral', 'woody', 'citrus', 'musk', 'oriental'];
  bases.forEach(base => {
    const variation = Math.floor(Math.random() * 10) - 5;
    blend[base] = Math.max(5, Math.min(60, blend[base] + variation));
  });
  
  // Normalize to 100
  const total = Object.values(blend).reduce((a, b) => a + b, 0);
  bases.forEach(base => {
    blend[base] = Math.round((blend[base] / total) * 100 / 5) * 5;
  });
  
  return blend;
};

export default function MoodMapPage({ onNavigate }: MoodMapPageProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [generatedBlend, setGeneratedBlend] = useState<Mood['blend'] | null>(null);
  const [showBlendPreview, setShowBlendPreview] = useState(false);
  const { setCurrentBlend, setAiSuggestion } = useApp();

  const handleMoodSelect = useCallback((mood: Mood) => {
    setSelectedMood(mood.id);
    setCurrentBlend({
      id: 'current',
      name: mood.name,
      ...mood.blend,
    });
    
    setAiSuggestion(`Based on your ${mood.name.toLowerCase()} mood, I've created: ${mood.blend.floral}% Floral, ${mood.blend.woody}% Woody, ${mood.blend.citrus}% Citrus, ${mood.blend.musk}% Musk, ${mood.blend.oriental}% Oriental`);
    
    setTimeout(() => {
      onNavigate('mixing-lab');
    }, 1500);
  }, [setCurrentBlend, setAiSuggestion, onNavigate]);

  const handleVoiceStart = useCallback(() => {
    setIsListening(true);
    setVoiceText('');
    setAiResponse(null);
    setGeneratedBlend(null);
    setShowBlendPreview(false);
    
    // Simulate voice recognition with example phrases
    const examples = [
      'Make it fresh for a morning meeting',
      'Something elegant for date night',
      'Light and casual for work',
      'Strong and woody for evening',
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    
    setTimeout(() => {
      setVoiceText(randomExample);
    }, 1500);
    
    setTimeout(() => {
      setIsListening(false);
      const blend = generateVoiceBlend(randomExample);
      setGeneratedBlend(blend);
      setAiResponse(`I've created a blend based on "${randomExample}". Here's your personalized fragrance formula.`);
      setShowBlendPreview(true);
    }, 3500);
  }, []);

  const handleVoiceEnd = useCallback(() => {
    setIsListening(false);
  }, []);

  const handleApplyBlend = useCallback(() => {
    if (generatedBlend) {
      setCurrentBlend({
        id: 'current',
        name: 'Voice Generated',
        ...generatedBlend,
      });
      setAiSuggestion(`Voice blend: ${generatedBlend.floral}% Floral, ${generatedBlend.woody}% Woody, ${generatedBlend.citrus}% Citrus, ${generatedBlend.musk}% Musk, ${generatedBlend.oriental}% Oriental`);
      onNavigate('mixing-lab');
    }
  }, [generatedBlend, setCurrentBlend, setAiSuggestion, onNavigate]);

  return (
    <div className="min-h-screen p-5">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-white" />
        </motion.button>
        
        <h1 className="text-2xl font-serif text-white">Mood Map</h1>
        
        <div className="w-10" />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-amber-400/80 text-xs tracking-widest uppercase text-center mb-6"
      >
        How do you feel today?
      </motion.p>

      {/* Mood Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleMoodSelect(mood)}
            className={`relative glass rounded-2xl p-5 aspect-square flex flex-col items-center justify-center gap-3 transition-all ${
              selectedMood === mood.id ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-400/20' : ''
            }`}
          >
            {/* Background gradient */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-10"
              style={{ background: `linear-gradient(135deg, ${mood.color}40, transparent)` }}
            />
            
            {/* Icon circle */}
            <motion.div
              animate={selectedMood === mood.id ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${mood.color}30`, color: mood.color }}
            >
              {mood.icon}
            </motion.div>
            
            {/* Text */}
            <div className="relative z-10 text-center">
              <h3 className="text-white font-medium">{mood.name}</h3>
              <p className="text-slate-400 text-xs">{mood.subtitle}</p>
            </div>

            {/* Selection indicator */}
            <AnimatePresence>
              {selectedMood === mood.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center"
                >
                  <Sparkles size={12} className="text-slate-900" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Voice Assistant */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
            <span className="text-amber-400/80 text-xs tracking-widest uppercase">
              Sonnet 4.6 Voice Assistant
            </span>
          </div>
          <Mic size={18} className="text-slate-400" />
        </div>

        {/* Example/Response text */}
        <div className="mb-4">
          <AnimatePresence mode="wait">
            {showBlendPreview && generatedBlend ? (
              <motion.div
                key="blend"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-amber-400 text-sm mb-3">{aiResponse}</p>
                <div className="glass rounded-xl p-3 mb-3">
                  <p className="text-white/60 text-xs mb-2">Your Blend Formula:</p>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div>
                      <p className="text-rose-400 text-lg font-bold">{generatedBlend.floral}%</p>
                      <p className="text-white/40 text-[10px]">Floral</p>
                    </div>
                    <div>
                      <p className="text-amber-600 text-lg font-bold">{generatedBlend.woody}%</p>
                      <p className="text-white/40 text-[10px]">Woody</p>
                    </div>
                    <div>
                      <p className="text-yellow-400 text-lg font-bold">{generatedBlend.citrus}%</p>
                      <p className="text-white/40 text-[10px]">Citrus</p>
                    </div>
                    <div>
                      <p className="text-purple-400 text-lg font-bold">{generatedBlend.musk}%</p>
                      <p className="text-white/40 text-[10px]">Musk</p>
                    </div>
                    <div>
                      <p className="text-red-400 text-lg font-bold">{generatedBlend.oriental}%</p>
                      <p className="text-white/40 text-[10px]">Oriental</p>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApplyBlend}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Apply This Blend
                </motion.button>
              </motion.div>
            ) : voiceText ? (
              <motion.p
                key="voice"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white text-sm"
              >
                "{voiceText}"
              </motion.p>
            ) : (
              <motion.p
                key="example"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400 text-sm italic"
              >
                "Make this scent a bit more fresh for a morning meeting"
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Voice button */}
        {!showBlendPreview && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseDown={handleVoiceStart}
            onMouseUp={handleVoiceEnd}
            onTouchStart={handleVoiceStart}
            onTouchEnd={handleVoiceEnd}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              isListening
                ? 'bg-amber-400 text-slate-900'
                : 'border border-slate-600 text-amber-400 hover:border-amber-400/50'
            }`}
          >
            {isListening ? (
              <>
                {/* Voice wave animation */}
                <div className="flex items-center gap-0.5 h-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 16, 4] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-1 bg-slate-900 rounded-full"
                    />
                  ))}
                </div>
                <span className="font-medium">Listening...</span>
              </>
            ) : (
              <>
                <Mic size={18} />
                <span className="font-medium">Hold to Speak</span>
              </>
            )}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

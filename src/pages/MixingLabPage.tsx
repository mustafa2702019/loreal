import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Check, ChevronRight } from 'lucide-react';
import type { PageType } from '../App';
import { useApp } from '../context/AppContext';

interface MixingLabPageProps {
  onNavigate: (page: PageType) => void;
}

interface BaseConfig {
  name: string;
  color: string;
  icon: string;
}

const bases: BaseConfig[] = [
  { name: 'Floral', color: '#ec4899', icon: '🌸' },
  { name: 'Woody', color: '#a16207', icon: '🌲' },
  { name: 'Citrus', color: '#eab308', icon: '🍋' },
  { name: 'Musk', color: '#a855f7', icon: '💜' },
  { name: 'Oriental', color: '#dc2626', icon: '🔥' },
];

export default function MixingLabPage({ onNavigate }: MixingLabPageProps) {
  const { currentBlend, updateBlendBase, saveBlend, setCurrentBlend, setAiSuggestion } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);
  const [blendName, setBlendName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [remixLoaded, setRemixLoaded] = useState(false);

  // Check for remix data from localStorage
  useEffect(() => {
    const remixBlend = localStorage.getItem('remixBlend');
    const remixSuggestion = localStorage.getItem('remixSuggestion');
    
    if (remixBlend && !remixLoaded) {
      const blend = JSON.parse(remixBlend);
      setCurrentBlend(blend);
      if (remixSuggestion) {
        setAiSuggestion(remixSuggestion);
      }
      setRemixLoaded(true);
      // Clear localStorage after loading
      localStorage.removeItem('remixBlend');
      localStorage.removeItem('remixSuggestion');
    }
  }, [setCurrentBlend, setAiSuggestion, remixLoaded]);

  const total = currentBlend.floral + currentBlend.woody + currentBlend.citrus + currentBlend.musk + currentBlend.oriental;

  const adjustBase = useCallback((baseName: string, delta: number) => {
    const key = baseName.toLowerCase() as 'floral' | 'woody' | 'citrus' | 'musk' | 'oriental';
    const currentValue = currentBlend[key];
    const newValue = Math.max(0, Math.min(100, currentValue + delta));
    updateBlendBase(key, newValue);
  }, [currentBlend, updateBlendBase]);

  const handleCreate = useCallback(() => {
    if (total === 100) {
      setShowNameInput(true);
    }
  }, [total]);

  const handleSaveBlend = useCallback(() => {
    if (blendName.trim()) {
      saveBlend({ ...currentBlend, name: blendName.trim() });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowNameInput(false);
        setBlendName('');
      }, 2000);
    }
  }, [currentBlend, blendName, saveBlend]);

  const getBaseValue = useCallback((name: string) => {
    const key = name.toLowerCase() as keyof typeof currentBlend;
    return currentBlend[key] as number;
  }, [currentBlend]);

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
        
        <h1 className="text-white text-lg font-medium">Mixing Lab</h1>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('saved-blends')}
          className="px-3 py-1.5 rounded-full glass text-amber-400 text-xs flex items-center gap-1"
        >
          Saved
          <ChevronRight size={14} />
        </motion.button>
      </motion.div>

      {/* Base Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="grid grid-cols-3 gap-4">
          {bases.map((base, index) => {
            const value = getBaseValue(base.name);
            const angle = (value / 100) * 360;
            
            return (
              <motion.div
                key={base.name}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex flex-col items-center"
              >
                {/* Circular Progress */}
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke={base.color}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      initial={{ strokeDashoffset: `${2 * Math.PI * 36}` }}
                      animate={{ strokeDashoffset: `${2 * Math.PI * 36 * (1 - value / 100)}` }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                  
                  {/* Value indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      key={value}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-white text-lg font-semibold"
                    >
                      {value}%
                    </motion.div>
                  </div>
                  
                  {/* Mini indicator dot */}
                  <motion.div
                    className="absolute w-2 h-2 rounded-full"
                    style={{ 
                      backgroundColor: base.color,
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: Math.cos((angle - 90) * Math.PI / 180) * 32 - 4,
                      y: Math.sin((angle - 90) * Math.PI / 180) * 32 - 4,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                {/* Base name */}
                <span className="text-slate-300 text-xs mb-2">{base.name}</span>
                
                {/* Controls */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => adjustBase(base.name, -5)}
                    className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <Minus size={14} className="text-white" />
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => adjustBase(base.name, 5)}
                    className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <Plus size={14} className="text-white" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Total Indicator */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mb-6"
      >
        <div className="text-center">
          <span className="text-slate-400 text-xs uppercase tracking-wider">Total</span>
          <motion.div
            key={total}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-3xl font-bold ${total === 100 ? 'text-green-400' : 'text-amber-400'}`}
          >
            {total}%
          </motion.div>
        </div>
      </motion.div>

      {/* Create Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: total === 100 ? 1.02 : 1 }}
        whileTap={{ scale: total === 100 ? 0.98 : 1 }}
        onClick={handleCreate}
        disabled={total !== 100}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          total === 100
            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900'
            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
        }`}
      >
        Create
      </motion.button>

      {/* Name Input Modal */}
      <AnimatePresence>
        {showNameInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5"
            onClick={() => setShowNameInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 w-full max-w-sm"
            >
              <h3 className="text-white text-lg font-medium mb-4">Name Your Blend</h3>
              <input
                type="text"
                value={blendName}
                onChange={(e) => setBlendName(e.target.value)}
                placeholder="Enter blend name..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNameInput(false)}
                  className="flex-1 py-3 rounded-xl glass text-slate-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveBlend}
                  disabled={!blendName.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-semibold disabled:opacity-50"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="glass rounded-2xl p-8 flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-green-400 flex items-center justify-center mb-4"
              >
                <Check size={32} className="text-slate-900" />
              </motion.div>
              <h3 className="text-white text-xl font-medium mb-2">Your fragrance is blended.</h3>
              <p className="text-slate-400 text-sm">Saved to your collection</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

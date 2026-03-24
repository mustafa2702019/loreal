import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BatteryWarning, Zap, Check, Plus, Minus } from 'lucide-react';
import type { PageType } from '../App';
import { useApp } from '../context/AppContext';

interface DeadBatteryBlendsPageProps {
  onNavigate: (page: PageType) => void;
}

interface DeadBlend {
  id: string;
  name: string;
  description: string;
  bases: { name: string; percentage: number }[];
}

const initialBlends: DeadBlend[] = [
  {
    id: '1',
    name: 'Last Light',
    description: 'When power fades, elegance remains',
    bases: [
      { name: 'Musk', percentage: 50 },
      { name: 'Woody', percentage: 30 },
      { name: 'Oriental', percentage: 20 },
    ],
  },
  {
    id: '2',
    name: 'Midnight Reserve',
    description: 'Pure essence for critical moments',
    bases: [
      { name: 'Floral', percentage: 45 },
      { name: 'Citrus', percentage: 35 },
      { name: 'Musk', percentage: 20 },
    ],
  },
  {
    id: '3',
    name: 'Emergency Elegance',
    description: 'Your signature, always ready',
    bases: [
      { name: 'Woody', percentage: 40 },
      { name: 'Oriental', percentage: 35 },
      { name: 'Citrus', percentage: 25 },
    ],
  },
];

const baseColors: Record<string, string> = {
  floral: 'from-rose-400/30 to-rose-500/20',
  woody: 'from-amber-700/30 to-amber-800/20',
  citrus: 'from-yellow-400/30 to-yellow-500/20',
  musk: 'from-purple-400/30 to-purple-500/20',
  oriental: 'from-red-400/30 to-red-500/20',
};

const baseSingleColors: Record<string, string> = {
  floral: '#e11d48',
  woody: '#b45309',
  citrus: '#eab308',
  musk: '#a855f7',
  oriental: '#dc2626',
};

export default function DeadBatteryBlendsPage({ onNavigate }: DeadBatteryBlendsPageProps) {
  const [blends, setBlends] = useState<DeadBlend[]>(initialBlends);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedBlend, setSelectedBlend] = useState<string | null>(null);
  const { setCurrentBlend } = useApp();

  const handleUseBlend = (blend: DeadBlend) => {
    const blendMap: Record<string, number> = {
      floral: 0,
      woody: 0,
      citrus: 0,
      musk: 0,
      oriental: 0,
    };
    
    blend.bases.forEach(b => {
      blendMap[b.name.toLowerCase()] = b.percentage;
    });
    
    setCurrentBlend({
      id: 'current',
      name: blend.name,
      floral: blendMap.floral,
      woody: blendMap.woody,
      citrus: blendMap.citrus,
      musk: blendMap.musk,
      oriental: blendMap.oriental,
    });
    
    setSelectedBlend(blend.id);
    
    setTimeout(() => {
      onNavigate('mixing-lab');
    }, 800);
  };

  const adjustBase = (blendId: string, baseName: string, delta: number) => {
    setBlends(prev => prev.map(blend => {
      if (blend.id !== blendId) return blend;
      
      const newBases = blend.bases.map(b => {
        if (b.name.toLowerCase() !== baseName.toLowerCase()) return b;
        const newValue = Math.max(10, Math.min(80, b.percentage + delta));
        return { ...b, percentage: newValue };
      });
      
      // Normalize to 100%
      const total = newBases.reduce((sum, b) => sum + b.percentage, 0);
      const normalized = newBases.map(b => ({
        ...b,
        percentage: Math.round((b.percentage / total) * 100 / 5) * 5,
      }));
      
      return { ...blend, bases: normalized };
    }));
  };

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
          <ArrowLeft size={20} className="text-white/80" />
        </motion.button>
        
        <div className="flex items-center gap-2">
          <BatteryWarning size={18} className="text-amber-300/80" />
          <span className="text-white/80 text-sm tracking-widest uppercase">Dead Battery Blends</span>
        </div>
        
        <div className="w-10" />
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-white/40 text-sm text-center mb-8"
      >
        Three essential blends for when your device needs charging
      </motion.p>

      {/* Blend Cards */}
      <div className="space-y-4">
        {blends.map((blend, index) => (
          <motion.div
            key={blend.id}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.15 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {editingId === blend.id ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-serif">{blend.name}</h3>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingId(null)}
                      className="text-white/60 text-sm"
                    >
                      Done
                    </motion.button>
                  </div>

                  {/* Edit Controls */}
                  <div className="space-y-3">
                    {blend.bases.map((base) => (
                      <div key={base.name} className="flex items-center gap-3">
                        <span className="text-white/60 text-sm w-20">{base.name}</span>
                        <div className="flex-1 flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => adjustBase(blend.id, base.name, -5)}
                            className="w-7 h-7 rounded-full glass flex items-center justify-center"
                          >
                            <Minus size={12} className="text-white/60" />
                          </motion.button>
                          
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: baseSingleColors[base.name.toLowerCase()] }}
                              animate={{ width: `${base.percentage}%` }}
                            />
                          </div>
                          
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => adjustBase(blend.id, base.name, 5)}
                            className="w-7 h-7 rounded-full glass flex items-center justify-center"
                          >
                            <Plus size={12} className="text-white/60" />
                          </motion.button>
                          
                          <span className="text-white/80 text-sm w-10 text-right">
                            {base.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-serif text-lg mb-1">{blend.name}</h3>
                      <p className="text-white/40 text-xs">{blend.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingId(blend.id)}
                        className="w-8 h-8 rounded-full glass flex items-center justify-center"
                      >
                        <Zap size={14} className="text-white/60" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="flex h-3 rounded-full overflow-hidden mb-4">
                    {blend.bases.map((base, i) => (
                      <motion.div
                        key={base.name}
                        initial={{ width: 0 }}
                        animate={{ width: `${base.percentage}%` }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className={`h-full bg-gradient-to-r ${baseColors[base.name.toLowerCase()]}`}
                      />
                    ))}
                  </div>

                  {/* Base Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blend.bases.map((base) => (
                      <span
                        key={base.name}
                        className="text-xs px-3 py-1 rounded-full glass text-white/60"
                      >
                        {base.name} {base.percentage}%
                      </span>
                    ))}
                  </div>

                  {/* Use Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUseBlend(blend)}
                    disabled={selectedBlend === blend.id}
                    className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                      selectedBlend === blend.id
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gradient-to-r from-amber-300/80 to-amber-400/60 text-slate-900'
                    }`}
                  >
                    {selectedBlend === blend.id ? (
                      <>
                        <Check size={18} />
                        Selected
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        Use This Blend
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 glass rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <BatteryWarning size={18} className="text-amber-300/60 flex-shrink-0 mt-0.5" />
          <p className="text-white/40 text-xs leading-relaxed">
            These blends are optimized for minimal power consumption. 
            Each contains exactly 3 scent bases for maximum efficiency 
            while maintaining your signature fragrance.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

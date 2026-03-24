import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Battery, Lightbulb } from 'lucide-react';
import type { PageType } from '../App';
import { useApp } from '../context/AppContext';

interface DeviceStatePageProps {
  onNavigate: (page: PageType) => void;
}

const baseColors: Record<string, string> = {
  floral: '#ec4899',
  woody: '#a16207',
  citrus: '#eab308',
  musk: '#a855f7',
  oriental: '#dc2626',
};

const lightColors = [
  { name: 'Warm', color: '#fbbf24' },
  { name: 'Cool', color: '#60a5fa' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Amber', color: '#f59e0b' },
];

export default function DeviceStatePage({ onNavigate }: DeviceStatePageProps) {
  const { deviceBattery, podLevels, ambientLight, toggleAmbientLight } = useApp();
  const [selectedLightColor, setSelectedLightColor] = useState(lightColors[0]);

  const podEntries = Object.entries(podLevels);

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
        
        <h1 className="text-2xl font-serif text-white">Device State</h1>
        
        <div className="w-10" />
      </motion.div>

      {/* Device Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-serif text-white mb-1">Laya' V1</h2>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-400"
              />
              <span className="text-green-400 text-sm">Connected</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-amber-400 mb-1">
              <Battery size={18} />
              <span className="text-2xl font-bold">{deviceBattery}%</span>
            </div>
            <span className="text-slate-400 text-xs">BATTERY</span>
          </div>
        </div>
      </motion.div>

      {/* Pod Levels */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <p className="text-amber-400/80 text-xs tracking-widest uppercase mb-4">Pod Levels</p>
        
        <div className="glass rounded-2xl p-4 space-y-4">
          {podEntries.map(([name, level], index) => (
            <motion.div
              key={name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-4"
            >
              <span className="text-slate-300 text-sm capitalize w-16">{name}</span>
              
              <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${level}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: baseColors[name],
                    opacity: level < 30 ? 0.7 : 1,
                  }}
                />
              </div>
              
              <span className={`text-sm font-medium w-10 text-right ${
                level < 30 ? 'text-red-400' : 'text-slate-300'
              }`}>
                {level}%
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ambient Light Control */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center">
              <Lightbulb size={20} className="text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Together in Paris</h4>
              <p className="text-slate-400 text-xs">Ambient Base Light</p>
            </div>
          </div>
          
          {/* Toggle Switch */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleAmbientLight}
            className={`w-12 h-7 rounded-full relative transition-colors ${
              ambientLight ? 'bg-amber-400' : 'bg-slate-600'
            }`}
          >
            <motion.div
              animate={{ x: ambientLight ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
            />
          </motion.button>
        </div>

        {/* Light Color Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: ambientLight ? 1 : 0.5 }}
          className="flex justify-center gap-3"
        >
          {lightColors.map((color) => (
            <motion.button
              key={color.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedLightColor(color)}
              className={`w-10 h-10 rounded-full transition-all ${
                selectedLightColor.name === color.name
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900'
                  : ''
              }`}
              style={{ backgroundColor: color.color }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Device Status */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 glass rounded-xl p-4"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Device Status</span>
          <span className="text-green-400 flex items-center gap-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
            Online
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-400">Last Sync</span>
          <span className="text-slate-300">Just now</span>
        </div>
      </motion.div>
    </div>
  );
}

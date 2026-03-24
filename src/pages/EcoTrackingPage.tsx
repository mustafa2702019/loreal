import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, Droplets, Package, TreePine, ShoppingBag } from 'lucide-react';
import type { PageType } from '../App';
import { useApp } from '../context/AppContext';

interface EcoTrackingPageProps {
  onNavigate: (page: PageType) => void;
}

export default function EcoTrackingPage({ onNavigate }: EcoTrackingPageProps) {
  const { ecoStats, podLevels } = useApp();

  const stats = [
    { 
      value: `${ecoStats.co2Saved}kg`, 
      label: 'CO2 Saved', 
      icon: <Leaf size={20} />,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
    },
    { 
      value: ecoStats.podsRecycled.toString(), 
      label: 'Pods Recycled', 
      icon: <Package size={20} />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/20',
    },
    { 
      value: ecoStats.treesPlanted.toString(), 
      label: 'Trees Planted', 
      icon: <TreePine size={20} />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/20',
    },
  ];

  const reorderItems = [
    {
      name: 'Musk Base Pod',
      status: `Low Level (${podLevels.musk}%)`,
      statusColor: 'text-red-400',
      icon: <Droplets size={20} />,
      action: 'Reorder',
    },
    {
      name: 'Discovery Set',
      status: '5x 10ml samples',
      statusColor: 'text-slate-400',
      icon: <ShoppingBag size={20} />,
      action: 'View',
    },
  ];

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
        
        <h1 className="text-2xl font-serif text-white">Sustainability</h1>
        
        <div className="w-10" />
      </motion.div>

      {/* Your Impact Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <p className="text-amber-400/80 text-xs tracking-widest uppercase mb-4">Your Impact</p>
        
        <div className="glass rounded-2xl p-6 text-center">
          {/* Leaf Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Leaf size={40} className="text-green-400" />
            </motion.div>
          </motion.div>
          
          {/* Main Stat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold text-white block mb-1"
            >
              {ecoStats.bottlesSaved}
            </motion.span>
            <span className="text-slate-400 text-sm">Glass Bottles Saved</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="glass rounded-xl p-3 text-center"
          >
            <div className={`w-10 h-10 mx-auto mb-2 rounded-full ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <span className={`text-xl font-bold ${stat.color} block`}>{stat.value}</span>
            <span className="text-slate-400 text-[10px]">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* One-Tap Reorder */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-amber-400/80 text-xs tracking-widest uppercase mb-4">One-Tap Reorder</p>
        
        <div className="space-y-3">
          {reorderItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="glass rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-amber-400">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium">{item.name}</h4>
                  <p className={`text-xs ${item.statusColor}`}>{item.status}</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg text-xs font-medium ${
                  item.action === 'Reorder'
                    ? 'bg-amber-400 text-slate-900'
                    : 'border border-slate-600 text-slate-300'
                }`}
              >
                {item.action}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 glass rounded-xl p-4"
      >
        <p className="text-slate-400 text-sm italic text-center leading-relaxed">
          "Laya' pods are made from 100% recycled ocean plastic and are fully recyclable through our Paris Atelier program."
        </p>
      </motion.div>

      {/* Eco Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: 'spring' }}
        className="mt-6 flex justify-center"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Leaf size={16} className="text-green-400" />
          </motion.div>
          <span className="text-green-400 text-xs">Eco-Friendly Partner</span>
        </div>
      </motion.div>
    </div>
  );
}

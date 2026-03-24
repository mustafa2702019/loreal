import { motion } from 'framer-motion';
import { Sparkles, FlaskConical, Users, Bookmark, Beaker, Cloud, Clock, BatteryWarning } from 'lucide-react';
import type { PageType } from '../App';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const quickAccessItems = [
    { icon: <Sparkles size={24} />, label: 'AI Designer', page: 'ai-designer-prompt' as PageType, color: 'from-amber-400/20 to-amber-500/10' },
    { icon: <FlaskConical size={24} />, label: 'Mixing Lab', page: 'mixing-lab' as PageType, color: 'from-purple-400/20 to-purple-500/10' },
    { icon: <Users size={24} />, label: 'Community', page: 'community' as PageType, color: 'from-pink-400/20 to-pink-500/10' },
    { icon: <Bookmark size={24} />, label: 'Saved Blends', page: 'saved-blends' as PageType, color: 'from-blue-400/20 to-blue-500/10' },
    { icon: <BatteryWarning size={24} />, label: 'Low Power', page: 'dead-battery-blends' as PageType, color: 'from-red-400/20 to-red-500/10' },
    { icon: <Beaker size={24} />, label: 'Bottle Status', page: 'device-state' as PageType, color: 'from-emerald-400/20 to-emerald-500/10' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen p-5">
      {/* Status Bar */}
      <div className="status-bar">
        <span className="text-white">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
        </div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between mb-6"
      >
        <div>
          <p className="text-amber-400/80 text-xs tracking-widest uppercase mb-1">Welcome Back</p>
          <h1 className="text-3xl font-serif text-white">Bonjour, Camille</h1>
          <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm">
            <span className="flex items-center gap-1">
              <Cloud size={14} />
              18°C Paris
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              09:42 AM
            </span>
          </div>
        </div>
        
        {/* Profile Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 p-0.5"
        >
          <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
            <img 
              src="https://i.pravatar.cc/150?u=camille" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* AI Recommendation Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="glass rounded-2xl p-5 relative overflow-hidden">
          {/* Animated background gradient */}
          <motion.div
            animate={{ 
              background: [
                'radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-0"
          />
          
          <div className="relative z-10">
            <p className="text-amber-400/80 text-xs tracking-widest uppercase mb-2">AI Recommended for Now</p>
            <h2 className="text-2xl font-serif text-white mb-1">Matin Doré</h2>
            <p className="text-slate-400 text-sm mb-4">Based on cloudy weather & your wool coat</p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('ai-designer-prompt')}
              className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2"
            >
              <Sparkles size={16} />
              AI DESIGNER
            </motion.button>
          </div>
          
          {/* Decorative sparkle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-4 right-4 w-12 h-12"
          >
            <Sparkles className="w-full h-full text-amber-400/30" />
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Access Grid */}
      <div>
        <p className="text-slate-400 text-xs tracking-widest uppercase mb-4">Quick Access</p>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-3"
        >
          {quickAccessItems.map((item) => (
            <motion.button
              key={item.label}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { type: 'spring', stiffness: 300 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(item.page)}
              className={`relative group`}
            >
              <div className={`glass rounded-2xl p-4 aspect-square flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-400/10`}>
                {/* Animated background on hover */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                
                <div className="relative z-10 text-amber-400 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="relative z-10 text-white text-xs font-medium">{item.label}</span>
              </div>
              
              {/* Floating particles on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"
              />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Live indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed top-20 right-5 flex items-center gap-2"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 bg-green-400 rounded-full"
        />
        <span className="text-green-400 text-xs">Live</span>
      </motion.div>
    </div>
  );
}

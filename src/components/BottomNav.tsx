import { motion } from 'framer-motion';
import { Home, SlidersHorizontal, Plus, Users, Leaf } from 'lucide-react';
import type { PageType } from '../App';

interface BottomNavProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const isActive = (page: PageType) => currentPage === page;
  const isMixerActive = isActive('mixing-lab') || isActive('saved-blends') || isActive('dead-battery-blends');

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
    >
      <div className="max-w-[430px] mx-auto">
        <div className="glass rounded-t-3xl px-4 py-3 flex items-center justify-around">
          <NavItem
            icon={<Home size={22} />}
            label="Home"
            isActive={isActive('home')}
            onClick={() => onNavigate('home')}
          />
          <NavItem
            icon={<SlidersHorizontal size={22} />}
            label="Mixer"
            isActive={isMixerActive}
            onClick={() => onNavigate('mixing-lab')}
          />
          
          {/* Center Add Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('mixing-lab')}
            className="relative -mt-8"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg glow-gold">
              <Plus size={28} className="text-slate-900" />
            </div>
          </motion.button>
          
          <NavItem
            icon={<Users size={22} />}
            label="Community"
            isActive={isActive('community')}
            onClick={() => onNavigate('community')}
          />
          <NavItem
            icon={<Leaf size={22} />}
            label="Eco"
            isActive={isActive('eco-tracking')}
            onClick={() => onNavigate('eco-tracking')}
          />
        </div>
      </div>
    </motion.nav>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
        isActive ? 'text-amber-400' : 'text-slate-400'
      }`}
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
      <span className="text-[10px] font-medium">{label}</span>
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-amber-400"
        />
      )}
    </motion.button>
  );
}

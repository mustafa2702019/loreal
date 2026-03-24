import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import AIAnalyzerPage from './pages/AIAnalyzerPage';
import AIDesignerPromptPage from './pages/AIDesignerPromptPage';
import MixingLabPage from './pages/MixingLabPage';
import SavedBlendsPage from './pages/SavedBlendsPage';
import DeadBatteryBlendsPage from './pages/DeadBatteryBlendsPage';
import CommunityPage from './pages/CommunityPage';
import MoodMapPage from './pages/MoodMapPage';
import EcoTrackingPage from './pages/EcoTrackingPage';
import DeviceStatePage from './pages/DeviceStatePage';
import BottomNav from './components/BottomNav';
import { AppProvider } from './context/AppContext';

export type PageType = 'welcome' | 'home' | 'ai-analyzer' | 'ai-designer-prompt' | 'mixing-lab' | 'saved-blends' | 'dead-battery-blends' | 'community' | 'mood-map' | 'eco-tracking' | 'device-state';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('welcome');
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    // Show bottom nav after welcome page
    setShowNav(currentPage !== 'welcome');
  }, [currentPage]);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage onComplete={() => navigateTo('home')} />;
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'ai-analyzer':
        return <AIAnalyzerPage onNavigate={navigateTo} />;
      case 'ai-designer-prompt':
        return <AIDesignerPromptPage onNavigate={navigateTo} />;
      case 'mixing-lab':
        return <MixingLabPage onNavigate={navigateTo} />;
      case 'saved-blends':
        return <SavedBlendsPage onNavigate={navigateTo} />;
      case 'dead-battery-blends':
        return <DeadBatteryBlendsPage onNavigate={navigateTo} />;
      case 'community':
        return <CommunityPage onNavigate={navigateTo} />;
      case 'mood-map':
        return <MoodMapPage onNavigate={navigateTo} />;
      case 'eco-tracking':
        return <EcoTrackingPage onNavigate={navigateTo} />;
      case 'device-state':
        return <DeviceStatePage onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <AppProvider>
      <div className="mobile-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="min-h-screen pb-24"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
        
        {showNav && (
          <BottomNav 
            currentPage={currentPage} 
            onNavigate={navigateTo} 
          />
        )}
      </div>
    </AppProvider>
  );
}

export default App;

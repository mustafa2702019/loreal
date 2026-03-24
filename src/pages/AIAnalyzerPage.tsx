import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Layers, Sparkles, Camera, Wand2 } from 'lucide-react';
import type { PageType } from '../App';
import { useApp } from '../context/AppContext';

interface AIAnalyzerPageProps {
  onNavigate: (page: PageType) => void;
}

interface AnalysisResult {
  textures: { name: string; value: number; icon: React.ReactNode }[];
  skinAnalysis: { name: string; value: number }[];
  aiLogic: string;
}

export default function AIAnalyzerPage({ onNavigate }: AIAnalyzerPageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setAiSuggestion } = useApp();

  const handleCapture = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setCapturedImage(imageUrl);
        setShowCamera(false);
        startAnalysis();
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setAnalysisResult({
        textures: [
          { name: 'Heavy Leather', value: 85, icon: <Layers size={16} /> },
          { name: 'Sheer Silk', value: 65, icon: <Sparkles size={16} /> },
          { name: 'Deep Burgundy', value: 70, icon: <Wand2 size={16} /> },
        ],
        skinAnalysis: [
          { name: 'Neutral Skin Tone', value: 80 },
          { name: 'Sensitive Type', value: 60 },
          { name: 'Natural Glow', value: 75 },
        ],
        aiLogic: '"Leather & Velvet detected: Recommending a Deeper, Woody Musk blend to complement the heavy textures. Silk accents suggest adding a light floral top note for contrast."',
      });
      setAiSuggestion('Woody Musk with floral top notes');
    }, 3000);
  }, [setAiSuggestion]);

  const handleCreateBlend = useCallback(() => {
    onNavigate('mixing-lab');
  }, [onNavigate]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setShowCamera(true);
    setAnalysisComplete(false);
    setAnalysisResult(null);
  }, []);

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
        
        <h1 className="text-amber-400 text-sm tracking-widest uppercase font-medium">AI Analyzer</h1>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRetake}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <RefreshCw size={18} className="text-white" />
        </motion.button>
      </motion.div>

      {/* Camera / Image Preview Area */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="glass rounded-3xl overflow-hidden aspect-[4/5] relative">
          <AnimatePresence mode="wait">
            {showCamera ? (
              <motion.div
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50"
              >
                {/* Camera frame */}
                <div className="relative w-48 h-64 border-2 border-dashed border-amber-400/40 rounded-2xl flex items-center justify-center mb-6">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera size={48} className="text-amber-400/50" />
                  </motion.div>
                  
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
                </div>
                
                <p className="text-slate-400 text-sm mb-4">Take a photo of your outfit</p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCapture}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg glow-gold"
                >
                  <Camera size={28} className="text-slate-900" />
                </motion.button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Analyzing overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full mb-4"
                    />
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-400" />
                      <span className="text-amber-400 text-sm">Analyzing...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisComplete && analysisResult && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Texture Analysis */}
            <div className="glass rounded-2xl p-4 mb-4">
              <h3 className="text-white text-lg font-medium mb-4">Texture Analysis</h3>
              
              <div className="space-y-3">
                {analysisResult.textures.map((texture, index) => (
                  <motion.div
                    key={texture.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400">
                      {texture.icon}
                    </div>
                    <span className="text-slate-300 text-sm flex-1">{texture.name}</span>
                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${texture.value}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Texture & Skin Analysis */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-4 mb-4"
            >
              <h3 className="text-white text-lg font-medium mb-4">Texture & Skin Analysis</h3>
              
              <div className="space-y-3">
                {analysisResult.skinAnalysis.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                    </div>
                    <span className="text-slate-300 text-sm flex-1">{item.name}</span>
                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Logic */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-2xl p-4 mb-6"
            >
              <p className="text-amber-400/80 text-xs tracking-widest uppercase mb-2">AI Logic</p>
              <p className="text-slate-300 text-sm italic leading-relaxed">
                {analysisResult.aiLogic}
              </p>
            </motion.div>

            {/* Create Blend Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateBlend}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 py-4 rounded-xl font-semibold text-lg"
            >
              Create Blend
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

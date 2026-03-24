import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Edit2, Check, X, Play, Trash2 } from 'lucide-react';
import type { PageType } from '../App';
import { useApp, type BlendRecipe } from '../context/AppContext';

interface SavedBlendsPageProps {
  onNavigate: (page: PageType) => void;
}

const baseColors: Record<string, string> = {
  floral: '#ec4899',
  woody: '#a16207',
  citrus: '#eab308',
  musk: '#a855f7',
  oriental: '#dc2626',
};

export default function SavedBlendsPage({ onNavigate }: SavedBlendsPageProps) {
  const { savedBlends, loadBlend, saveBlend, setCurrentBlend } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<BlendRecipe | null>(null);

  const handleEdit = (blend: BlendRecipe) => {
    setEditingId(blend.id);
    setEditValues({ ...blend });
  };

  const handleSaveEdit = () => {
    if (editValues) {
      const total = editValues.floral + editValues.woody + editValues.citrus + editValues.musk + editValues.oriental;
      if (total === 100) {
        saveBlend(editValues);
        setEditingId(null);
        setEditValues(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues(null);
  };

  const handleUseBlend = (blend: BlendRecipe) => {
    loadBlend(blend.id);
    onNavigate('mixing-lab');
  };

  const adjustValue = (key: keyof BlendRecipe, delta: number) => {
    if (editValues) {
      const newValue = Math.max(0, Math.min(100, (editValues[key] as number) + delta));
      setEditValues({ ...editValues, [key]: newValue });
    }
  };

  const handleDelete = (_id: string) => {
    // In a real app, you'd remove from savedBlends
    // For now, we'll just close the edit mode
    setEditingId(null);
    setEditValues(null);
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
          onClick={() => onNavigate('mixing-lab')}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-white" />
        </motion.button>
        
        <h1 className="text-white text-lg font-medium">Saved Blends</h1>
        
        <div className="w-10" />
      </motion.div>

      {/* Blend Cards */}
      <div className="space-y-4">
        {savedBlends.map((blend, index) => (
          <motion.div
            key={blend.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-4"
          >
            <AnimatePresence mode="wait">
              {editingId === blend.id && editValues ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Edit Mode */}
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={editValues.name}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm flex-1 mr-3"
                    />
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSaveEdit}
                        className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center"
                      >
                        <Check size={16} className="text-green-400" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCancelEdit}
                        className="w-8 h-8 rounded-full bg-red-400/20 flex items-center justify-center"
                      >
                        <X size={16} className="text-red-400" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Edit Controls */}
                  <div className="space-y-2 mb-4">
                    {Object.entries(baseColors).map(([key, color]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-slate-400 text-xs capitalize w-16">{key}</span>
                        <div className="flex-1 flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => adjustValue(key as keyof BlendRecipe, -5)}
                            className="w-6 h-6 rounded-full glass flex items-center justify-center"
                          >
                            <span className="text-white text-xs">-</span>
                          </motion.button>
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: color }}
                              animate={{ width: `${editValues[key as keyof BlendRecipe]}%` }}
                            />
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => adjustValue(key as keyof BlendRecipe, 5)}
                            className="w-6 h-6 rounded-full glass flex items-center justify-center"
                          >
                            <span className="text-white text-xs">+</span>
                          </motion.button>
                          <span className="text-white text-xs w-8 text-right">
                            {editValues[key as keyof BlendRecipe]}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${
                      (editValues.floral + editValues.woody + editValues.citrus + editValues.musk + editValues.oriental) === 100 
                        ? 'text-green-400' 
                        : 'text-amber-400'
                    }`}>
                      Total: {editValues.floral + editValues.woody + editValues.citrus + editValues.musk + editValues.oriental}%
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(blend.id)}
                      className="text-red-400 text-xs flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* View Mode */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">{blend.name}</h3>
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(blend)}
                        className="w-8 h-8 rounded-full glass flex items-center justify-center"
                      >
                        <Edit2 size={14} className="text-slate-400" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Recipe Preview */}
                  <div className="flex gap-1 mb-4 h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${blend.floral}%` }}
                      className="h-full rounded-l-full"
                      style={{ backgroundColor: baseColors.floral }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${blend.woody}%` }}
                      className="h-full"
                      style={{ backgroundColor: baseColors.woody }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${blend.citrus}%` }}
                      className="h-full"
                      style={{ backgroundColor: baseColors.citrus }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${blend.musk}%` }}
                      className="h-full"
                      style={{ backgroundColor: baseColors.musk }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${blend.oriental}%` }}
                      className="h-full rounded-r-full"
                      style={{ backgroundColor: baseColors.oriental }}
                    />
                  </div>

                  {/* Recipe Details */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      { name: 'Floral', value: blend.floral },
                      { name: 'Woody', value: blend.woody },
                      { name: 'Citrus', value: blend.citrus },
                      { name: 'Musk', value: blend.musk },
                      { name: 'Oriental', value: blend.oriental },
                    ].filter(item => item.value > 0).map(item => (
                      <span
                        key={item.name}
                        className="text-xs px-2 py-1 rounded-full glass text-slate-300"
                      >
                        {item.name} {item.value}%
                      </span>
                    ))}
                  </div>

                  {/* Use Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUseBlend(blend)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-semibold flex items-center justify-center gap-2"
                  >
                    <Play size={16} />
                    Use This Blend
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Create New Blend Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setCurrentBlend({
            id: 'current',
            name: 'New Blend',
            floral: 20,
            woody: 20,
            citrus: 20,
            musk: 20,
            oriental: 20,
          });
          onNavigate('mixing-lab');
        }}
        className="w-full mt-4 py-4 rounded-xl border-2 border-dashed border-slate-600 text-slate-400 font-medium flex items-center justify-center gap-2 hover:border-amber-400/50 hover:text-amber-400 transition-colors"
      >
        <span className="text-xl">+</span>
        Create New Blend
      </motion.button>
    </div>
  );
}

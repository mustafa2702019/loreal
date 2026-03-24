import React, { createContext, useContext, useState, useCallback } from 'react';

export interface BlendRecipe {
  id: string;
  name: string;
  floral: number;
  woody: number;
  citrus: number;
  musk: number;
  oriental: number;
}

export interface Post {
  id: string;
  author: string;
  location: string;
  avatar: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  likes: number;
  comments: Comment[];
  recipe: { name: string; percentage: number }[];
  isMasterBlender?: boolean;
  timestamp: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface MoodConfig {
  name: string;
  floral: number;
  woody: number;
  citrus: number;
  musk: number;
  oriental: number;
}

interface AppContextType {
  // Current blend being edited
  currentBlend: BlendRecipe;
  setCurrentBlend: (blend: BlendRecipe) => void;
  updateBlendBase: (base: keyof Omit<BlendRecipe, 'id' | 'name'>, value: number) => void;
  
  // Saved blends
  savedBlends: BlendRecipe[];
  saveBlend: (blend: BlendRecipe) => void;
  loadBlend: (id: string) => void;
  
  // Community posts
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'comments' | 'likes'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  
  // Device state
  deviceBattery: number;
  podLevels: {
    floral: number;
    woody: number;
    citrus: number;
    musk: number;
    oriental: number;
  };
  ambientLight: boolean;
  toggleAmbientLight: () => void;
  
  // Eco tracking
  ecoStats: {
    bottlesSaved: number;
    co2Saved: number;
    podsRecycled: number;
    treesPlanted: number;
  };
  
  // Mood presets
  moodPresets: Record<string, MoodConfig>;
  applyMood: (mood: string) => void;
  
  // AI suggestions
  aiSuggestion: string | null;
  setAiSuggestion: (suggestion: string | null) => void;
}

const defaultBlend: BlendRecipe = {
  id: 'current',
  name: 'New Blend',
  floral: 20,
  woody: 20,
  citrus: 20,
  musk: 20,
  oriental: 20,
};

const defaultSavedBlends: BlendRecipe[] = [
  { id: '1', name: 'Morning Dew', floral: 30, woody: 10, citrus: 40, musk: 10, oriental: 10 },
  { id: '2', name: 'Evening Rose', floral: 50, woody: 20, citrus: 5, musk: 15, oriental: 10 },
  { id: '3', name: 'Midnight Oud', floral: 10, woody: 40, citrus: 5, musk: 25, oriental: 20 },
];

const defaultPosts: Post[] = [
  {
    id: '1',
    author: 'Marie_Dubois',
    location: 'Paris',
    avatar: 'https://i.pravatar.cc/150?u=marie',
    title: 'Éternité',
    description: 'A timeless blend for special occasions. Rich and elegant.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400',
    rating: 2.4,
    likes: 1240,
    comments: [
      { id: 'c1', author: 'Jean_Pierre', text: 'Absolutely stunning! Love the vanilla notes.', timestamp: '2h ago' },
      { id: 'c2', author: 'Sophie_L', text: 'My new signature scent!', timestamp: '5h ago' },
    ],
    recipe: [{ name: 'Rose', percentage: 40 }, { name: 'Oud', percentage: 30 }, { name: 'Vanilla', percentage: 30 }],
    isMasterBlender: true,
    timestamp: '1d ago',
  },
  {
    id: '2',
    author: 'Jean_Pierre',
    location: 'Lyon',
    avatar: 'https://i.pravatar.cc/150?u=jean',
    title: 'Morning Mist',
    description: 'Perfect for early spring mornings. Light and airy.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    rating: 4.8,
    likes: 456,
    comments: [
      { id: 'c3', author: 'Marie_Dubois', text: 'So refreshing!', timestamp: '1h ago' },
    ],
    recipe: [{ name: 'Citrus', percentage: 50 }, { name: 'Floral', percentage: 30 }, { name: 'Musk', percentage: 20 }],
    timestamp: '2d ago',
  },
  {
    id: '3',
    author: 'Sophie_L',
    location: 'Nice',
    avatar: 'https://i.pravatar.cc/150?u=sophie',
    title: 'Summer Breeze',
    description: 'Fresh and invigorating for hot summer days.',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400',
    rating: 4.5,
    likes: 892,
    comments: [],
    recipe: [{ name: 'Citrus', percentage: 60 }, { name: 'Floral', percentage: 25 }, { name: 'Woody', percentage: 15 }],
    timestamp: '3d ago',
  },
  {
    id: '4',
    author: 'Pierre_M',
    location: 'Bordeaux',
    avatar: 'https://i.pravatar.cc/150?u=pierre',
    title: 'Velvet Night',
    description: 'Deep and mysterious for evening wear.',
    image: 'https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=400',
    rating: 4.9,
    likes: 723,
    comments: [
      { id: 'c4', author: 'Marie_Dubois', text: 'Perfect for date night!', timestamp: '30m ago' },
      { id: 'c5', author: 'Jean_Pierre', text: 'The oud is perfectly balanced.', timestamp: '2h ago' },
    ],
    recipe: [{ name: 'Oud', percentage: 45 }, { name: 'Musk', percentage: 35 }, { name: 'Rose', percentage: 20 }],
    timestamp: '4d ago',
  },
  {
    id: '5',
    author: 'Claire_D',
    location: 'Marseille',
    avatar: 'https://i.pravatar.cc/150?u=claire',
    title: 'Ocean Mist',
    description: 'Inspired by the Mediterranean sea.',
    image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400',
    rating: 4.2,
    likes: 334,
    comments: [],
    recipe: [{ name: 'Citrus', percentage: 45 }, { name: 'Musk', percentage: 30 }, { name: 'Woody', percentage: 25 }],
    timestamp: '5d ago',
  },
  {
    id: '6',
    author: 'Antoine_R',
    location: 'Toulouse',
    avatar: 'https://i.pravatar.cc/150?u=antoine',
    title: 'Golden Hour',
    description: 'Warm and comforting like sunset.',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400',
    rating: 4.7,
    likes: 567,
    comments: [
      { id: 'c6', author: 'Sophie_L', text: 'This is pure magic!', timestamp: '1d ago' },
    ],
    recipe: [{ name: 'Vanilla', percentage: 40 }, { name: 'Amber', percentage: 35 }, { name: 'Citrus', percentage: 25 }],
    timestamp: '6d ago',
  },
];

const moodPresets: Record<string, MoodConfig> = {
  sophisticated: { name: 'Sophisticated', floral: 15, woody: 35, citrus: 10, musk: 25, oriental: 15 },
  energetic: { name: 'Energetic', floral: 20, woody: 10, citrus: 50, musk: 10, oriental: 10 },
  romantic: { name: 'Romantic', floral: 45, woody: 15, citrus: 10, musk: 20, oriental: 10 },
  playful: { name: 'Playful', floral: 35, woody: 10, citrus: 30, musk: 15, oriental: 10 },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentBlend, setCurrentBlend] = useState<BlendRecipe>(defaultBlend);
  const [savedBlends, setSavedBlends] = useState<BlendRecipe[]>(defaultSavedBlends);
  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const [deviceBattery] = useState(84);
  const [podLevels] = useState({
    floral: 80,
    woody: 45,
    citrus: 90,
    musk: 20,
    oriental: 60,
  });
  const [ambientLight, setAmbientLight] = useState(true);
  const [ecoStats] = useState({
    bottlesSaved: 47,
    co2Saved: 12,
    podsRecycled: 24,
    treesPlanted: 3,
  });
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const updateBlendBase = useCallback((base: keyof Omit<BlendRecipe, 'id' | 'name'>, value: number) => {
    setCurrentBlend(prev => ({ ...prev, [base]: value }));
  }, []);

  const saveBlend = useCallback((blend: BlendRecipe) => {
    setSavedBlends(prev => {
      const exists = prev.find(b => b.id === blend.id);
      if (exists) {
        return prev.map(b => b.id === blend.id ? blend : b);
      }
      return [...prev, { ...blend, id: Date.now().toString() }];
    });
  }, []);

  const loadBlend = useCallback((id: string) => {
    const blend = savedBlends.find(b => b.id === id);
    if (blend) {
      setCurrentBlend({ ...blend, id: 'current' });
    }
  }, [savedBlends]);

  const addPost = useCallback((post: Omit<Post, 'id' | 'timestamp' | 'comments' | 'likes'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      timestamp: 'Just now',
      comments: [],
      likes: 0,
    };
    setPosts(prev => [newPost, ...prev]);
  }, []);

  const likePost = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  }, []);

  const addComment = useCallback((postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: 'Just now',
    };
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
    ));
  }, []);

  const toggleAmbientLight = useCallback(() => {
    setAmbientLight(prev => !prev);
  }, []);

  const applyMood = useCallback((mood: string) => {
    const preset = moodPresets[mood];
    if (preset) {
      setCurrentBlend(prev => ({
        ...prev,
        floral: preset.floral,
        woody: preset.woody,
        citrus: preset.citrus,
        musk: preset.musk,
        oriental: preset.oriental,
      }));
    }
  }, []);

  return (
    <AppContext.Provider value={{
      currentBlend,
      setCurrentBlend,
      updateBlendBase,
      savedBlends,
      saveBlend,
      loadBlend,
      posts,
      addPost,
      likePost,
      addComment,
      deviceBattery,
      podLevels,
      ambientLight,
      toggleAmbientLight,
      ecoStats,
      moodPresets,
      applyMood,
      aiSuggestion,
      setAiSuggestion,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

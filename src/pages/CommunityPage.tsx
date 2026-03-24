import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Star, ArrowUp, GitBranch, Send } from 'lucide-react';
import type { PageType } from '../App';
import { useApp, type Post } from '../context/AppContext';

type TabType = 'trending' | 'new' | 'following';

interface CommunityPageProps {
  onNavigate: (page: PageType) => void;
}

// TRENDING POSTS - High ratings, popular blends
const trendingPosts: Post[] = [
  {
    id: 't1',
    author: 'Marie_Dubois',
    location: 'Paris',
    avatar: 'https://i.pravatar.cc/150?u=marie',
    title: 'Éternité',
    description: 'A timeless blend that has captivated thousands. Pure elegance in every drop.',
    image: 'https://cdn.shopify.com/s/files/1/0271/6071/files/Lady_with_perfume-1800.jpg?v=1527177747',
    rating: 4.9,
    likes: 3420,
    comments: [
      { id: 'tc1', author: 'Jean_Pierre', text: 'Absolutely divine! My signature scent.', timestamp: '2h ago' },
      { id: 'tc2', author: 'Sophie_L', text: 'Worth every penny. Exquisite!', timestamp: '5h ago' },
      { id: 'tc3', author: 'Lucas_M', text: 'The vanilla notes are perfection.', timestamp: '1d ago' },
    ],
    recipe: [{ name: 'Rose', percentage: 40 }, { name: 'Oud', percentage: 35 }, { name: 'Vanilla', percentage: 25 }],
    isMasterBlender: true,
    timestamp: '2d ago',
  },
  {
    id: 't2',
    author: 'Alexander_V',
    location: 'Vienna',
    avatar: 'https://i.pravatar.cc/150?u=alexander',
    title: 'Imperial Oud',
    description: 'A commanding presence. For those who demand attention.',
    image: 'https://www.yslbeautyth.com/dw/image/v2/BFZM_PRD/on/demandware.static/-/Sites-ysl-master-catalog/default/dw9078db30/images/fragrance-free/WW-50424YSL/WW-50424YSL-3614272648425-90ml-IMAGE1.jpg?sw=1080&sh=1080&sm=cut&sfrm=png&q=85',
    rating: 4.8,
    likes: 2890,
    comments: [
      { id: 'tc4', author: 'Isabella_R', text: 'Powerful and long-lasting.', timestamp: '3h ago' },
    ],
    recipe: [{ name: 'Oud', percentage: 50 }, { name: 'Amber', percentage: 30 }, { name: 'Musk', percentage: 20 }],
    isMasterBlender: true,
    timestamp: '3d ago',
  },
  {
    id: 't3',
    author: 'Charlotte_W',
    location: 'London',
    avatar: 'https://i.pravatar.cc/150?u=charlotte',
    title: 'Royal Garden',
    description: 'The most liked blend this month. A floral masterpiece.',
    image: 'https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=400',
    rating: 4.7,
    likes: 4567,
    comments: [
      { id: 'tc5', author: 'William_H', text: 'My wife loves this!', timestamp: '1h ago' },
      { id: 'tc6', author: 'Emma_S', text: 'Perfect for spring.', timestamp: '4h ago' },
      { id: 'tc7', author: 'Oliver_B', text: 'Simply beautiful.', timestamp: '6h ago' },
    ],
    recipe: [{ name: 'Rose', percentage: 45 }, { name: 'Jasmine', percentage: 35 }, { name: 'Lily', percentage: 20 }],
    isMasterBlender: true,
    timestamp: '1d ago',
  },
  {
    id: 't4',
    author: 'Sebastian_K',
    location: 'Berlin',
    avatar: 'https://i.pravatar.cc/150?u=sebastian',
    title: 'Midnight Velvet',
    description: 'Dark, mysterious, and utterly captivating.',
    image: 'https://www.instyle.com/thmb/IyVNg6eRW8KIsnA2zYbGEVSPsv8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/011426-perfume-436986895da74f38908978af5720d868.jpg',
    rating: 4.8,
    likes: 2156,
    comments: [],
    recipe: [{ name: 'Patchouli', percentage: 40 }, { name: 'Vanilla', percentage: 35 }, { name: 'Sandalwood', percentage: 25 }],
    timestamp: '4d ago',
  },
  {
    id: 't5',
    author: 'Victoria_S',
    location: 'Monaco',
    avatar: 'https://i.pravatar.cc/150?u=victoria',
    title: 'Côte d\'Azur',
    description: 'Mediterranean breeze in a bottle. Summer essential.',
    image: 'https://cdn.shopify.com/s/files/1/0436/4012/7649/files/Perfume-Scents.jpg?v=1630654940',
    rating: 4.6,
    likes: 1876,
    comments: [
      { id: 'tc8', author: 'Daniel_R', text: 'Takes me back to the Riviera!', timestamp: '2h ago' },
    ],
    recipe: [{ name: 'Citrus', percentage: 50 }, { name: 'Sea Salt', percentage: 30 }, { name: 'Driftwood', percentage: 20 }],
    timestamp: '5d ago',
  },
  {
    id: 't6',
    author: 'Nicholas_B',
    location: 'New York',
    avatar: 'https://i.pravatar.cc/150?u=nicholas',
    title: 'Manhattan Nights',
    description: 'Sophisticated urban elegance. The city that never sleeps.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400',
    rating: 4.7,
    likes: 2345,
    comments: [
      { id: 'tc9', author: 'Riley_J', text: 'Perfect for date night.', timestamp: '30m ago' },
      { id: 'tc10', author: 'Aubrey_K', text: 'Classy and confident.', timestamp: '3h ago' },
    ],
    recipe: [{ name: 'Leather', percentage: 40 }, { name: 'Tobacco', percentage: 35 }, { name: 'Cedar', percentage: 25 }],
    isMasterBlender: true,
    timestamp: '2d ago',
  },
  {
    id: 't7',
    author: 'Grace_H',
    location: 'Singapore',
    avatar: 'https://i.pravatar.cc/150?u=grace',
    title: 'Orchid Pearl',
    description: 'Exotic Eastern beauty. Delicate yet memorable.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
    rating: 4.9,
    likes: 3123,
    comments: [
      { id: 'tc11', author: 'Matthew_C', text: 'Unique and beautiful.', timestamp: '1h ago' },
    ],
    recipe: [{ name: 'Orchid', percentage: 45 }, { name: 'Jasmine', percentage: 30 }, { name: 'Sandalwood', percentage: 25 }],
    timestamp: '3d ago',
  },
  {
    id: 't8',
    author: 'Christopher_M',
    location: 'Los Angeles',
    avatar: 'https://i.pravatar.cc/150?u=christopher',
    title: 'Golden Hour',
    description: 'When the sun meets the ocean. Pure California magic.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    rating: 4.5,
    likes: 1654,
    comments: [],
    recipe: [{ name: 'Bergamot', percentage: 40 }, { name: 'Amber', percentage: 35 }, { name: 'Coconut', percentage: 25 }],
    timestamp: '6d ago',
  },
];

// NEW POSTS - Fresh uploads, experimental blends
const newPosts: Post[] = [
  {
    id: 'n1',
    author: 'Zoe_P',
    location: 'Melbourne',
    avatar: 'https://i.pravatar.cc/150?u=zoe',
    title: 'First Bloom',
    description: 'Just created this! Fresh floral with a twist.',
    image: 'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=400',
    rating: 4.2,
    likes: 89,
    comments: [
      { id: 'nc1', author: 'Samuel_W', text: 'Love the creativity!', timestamp: '15m ago' },
    ],
    recipe: [{ name: 'Peony', percentage: 50 }, { name: 'Freesia', percentage: 30 }, { name: 'Musk', percentage: 20 }],
    timestamp: 'Just now',
  },
  {
    id: 'n2',
    author: 'Tyler_G',
    location: 'Toronto',
    avatar: 'https://i.pravatar.cc/150?u=tyler',
    title: 'Maplewood',
    description: 'Experimenting with woody notes. What do you think?',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    rating: 3.9,
    likes: 67,
    comments: [],
    recipe: [{ name: 'Maple', percentage: 45 }, { name: 'Cedar', percentage: 35 }, { name: 'Vanilla', percentage: 20 }],
    timestamp: '5m ago',
  },
  {
    id: 'n3',
    author: 'Hannah_L',
    location: 'Copenhagen',
    avatar: 'https://i.pravatar.cc/150?u=hannah',
    title: 'Nordic Frost',
    description: 'Inspired by winter mornings. Cool and crisp.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    rating: 4.1,
    likes: 134,
    comments: [
      { id: 'nc2', author: 'David_K', text: 'Very refreshing!', timestamp: '20m ago' },
      { id: 'nc3', author: 'Chloe_R', text: 'Perfect for winter.', timestamp: '45m ago' },
    ],
    recipe: [{ name: 'Pine', percentage: 40 }, { name: 'Eucalyptus', percentage: 35 }, { name: 'Mint', percentage: 25 }],
    timestamp: '15m ago',
  },
  {
    id: 'n4',
    author: 'Joseph_T',
    location: 'Dubai',
    avatar: 'https://i.pravatar.cc/150?u=joseph',
    title: 'Desert Rose',
    description: 'My first blend! Inspired by Arabian nights.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    rating: 4.0,
    likes: 156,
    comments: [
      { id: 'nc4', author: 'Natalie_B', text: 'Welcome to the community!', timestamp: '10m ago' },
    ],
    recipe: [{ name: 'Rose', percentage: 45 }, { name: 'Saffron', percentage: 30 }, { name: 'Amber', percentage: 25 }],
    timestamp: '30m ago',
  },
  {
    id: 'n5',
    author: 'Lily_A',
    location: 'Seoul',
    avatar: 'https://i.pravatar.cc/150?u=lily',
    title: 'Cherry Blossom Rain',
    description: 'Spring in Seoul captured in a bottle.',
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400',
    rating: 4.3,
    likes: 223,
    comments: [
      { id: 'nc5', author: 'Andrew_P', text: 'So delicate and beautiful!', timestamp: '25m ago' },
      { id: 'nc6', author: 'Addison_M', text: 'Love the concept!', timestamp: '1h ago' },
    ],
    recipe: [{ name: 'Cherry', percentage: 40 }, { name: 'Sakura', percentage: 35 }, { name: 'Green Tea', percentage: 25 }],
    timestamp: '1h ago',
  },
  {
    id: 'n6',
    author: 'Brandon_F',
    location: 'Austin',
    avatar: 'https://i.pravatar.cc/150?u=brandon',
    title: 'Texas Heat',
    description: 'Bold and spicy. Not for the faint-hearted.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    rating: 3.8,
    likes: 98,
    comments: [],
    recipe: [{ name: 'Pepper', percentage: 40 }, { name: 'Cedar', percentage: 35 }, { name: 'Leather', percentage: 25 }],
    timestamp: '2h ago',
  },
  {
    id: 'n7',
    author: 'Scarlett_J',
    location: 'Miami',
    avatar: 'https://i.pravatar.cc/150?u=scarlett',
    title: 'Ocean Drive',
    description: 'Beach vibes all year round. Fresh and fun!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rating: 4.2,
    likes: 187,
    comments: [
      { id: 'nc7', author: 'Jonathan_S', text: 'Summer in a bottle!', timestamp: '40m ago' },
    ],
    recipe: [{ name: 'Coconut', percentage: 45 }, { name: 'Sea Salt', percentage: 30 }, { name: 'Lime', percentage: 25 }],
    timestamp: '3h ago',
  },
  {
    id: 'n8',
    author: 'Ryan_C',
    location: 'Vancouver',
    avatar: 'https://i.pravatar.cc/150?u=ryan',
    title: 'Rainforest Mist',
    description: 'Fresh from the Pacific Northwest.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    rating: 4.0,
    likes: 145,
    comments: [
      { id: 'nc8', author: 'Brooklyn_W', text: 'So fresh!', timestamp: '1h ago' },
      { id: 'nc9', author: 'Nora_D', text: 'Love the green notes.', timestamp: '2h ago' },
    ],
    recipe: [{ name: 'Fern', percentage: 45 }, { name: 'Rain', percentage: 30 }, { name: 'Moss', percentage: 25 }],
    timestamp: '4h ago',
  },
];

// FOLLOWING POSTS - From followed creators, curated selection
const followingPosts: Post[] = [
  {
    id: 'f1',
    author: 'Emma_Watson',
    location: 'London',
    avatar: 'https://i.pravatar.cc/150?u=emmaw',
    title: 'Bookshop Afternoon',
    description: 'The scent of old books and Earl Grey tea. Cozy and intellectual.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rating: 4.7,
    likes: 8923,
    comments: [
      { id: 'fc1', author: 'Tom_F', text: 'This is pure magic!', timestamp: '1h ago' },
      { id: 'fc2', author: 'Lisa_M', text: 'My comfort scent.', timestamp: '3h ago' },
    ],
    recipe: [{ name: 'Paper', percentage: 40 }, { name: 'Tea', percentage: 35 }, { name: 'Vanilla', percentage: 25 }],
    isMasterBlender: true,
    timestamp: '5h ago',
  },
  {
    id: 'f2',
    author: 'Chef_Gordon',
    location: 'London',
    avatar: 'https://i.pravatar.cc/150?u=gordon',
    title: 'Kitchen Confidential',
    description: 'Fresh herbs and citrus. Inspired by my kitchen.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    rating: 4.5,
    likes: 4567,
    comments: [
      { id: 'fc3', author: 'Marco_P', text: 'Brilliant concept!', timestamp: '30m ago' },
    ],
    recipe: [{ name: 'Basil', percentage: 40 }, { name: 'Lemon', percentage: 35 }, { name: 'Olive', percentage: 25 }],
    timestamp: '8h ago',
  },
  {
    id: 'f3',
    author: 'Zendaya_Style',
    location: 'Los Angeles',
    avatar: 'https://i.pravatar.cc/150?u=zendaya',
    title: 'Red Carpet Ready',
    description: 'My go-to for every premiere. Confident and glamorous.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
    rating: 4.8,
    likes: 12345,
    comments: [
      { id: 'fc4', author: 'Fashion_L', text: 'Iconic!', timestamp: '2h ago' },
      { id: 'fc5', author: 'Vogue_E', text: 'Simply stunning.', timestamp: '4h ago' },
      { id: 'fc6', author: 'Elle_M', text: 'Must try!', timestamp: '6h ago' },
    ],
    recipe: [{ name: 'Jasmine', percentage: 45 }, { name: 'Amber', percentage: 30 }, { name: 'Musk', percentage: 25 }],
    isMasterBlender: true,
    timestamp: '12h ago',
  },
  {
    id: 'f4',
    author: 'Timothee_C',
    location: 'New York',
    avatar: 'https://i.pravatar.cc/150?u=timothee',
    title: 'Brooklyn Boy',
    description: 'Artisan coffee and autumn leaves. Brooklyn vibes.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400',
    rating: 4.6,
    likes: 6789,
    comments: [],
    recipe: [{ name: 'Coffee', percentage: 45 }, { name: 'Cedar', percentage: 30 }, { name: 'Cinnamon', percentage: 25 }],
    timestamp: '1d ago',
  },
  {
    id: 'f5',
    author: 'Tilda_S',
    location: 'Edinburgh',
    avatar: 'https://i.pravatar.cc/150?u=tilda',
    title: 'Scottish Highlands',
    description: 'Misty mornings and heather fields. Mystical and wild.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rating: 4.9,
    likes: 5432,
    comments: [
      { id: 'fc7', author: 'Ewan_M', text: 'Takes me home.', timestamp: '1h ago' },
    ],
    recipe: [{ name: 'Heather', percentage: 50 }, { name: 'Peat', percentage: 30 }, { name: 'Rain', percentage: 20 }],
    isMasterBlender: true,
    timestamp: '2d ago',
  },
  {
    id: 'f6',
    author: 'Dev_Patel',
    location: 'Mumbai',
    avatar: 'https://i.pravatar.cc/150?u=dev',
    title: 'Monsoon Memories',
    description: 'The smell of rain on hot earth. Nostalgic and beautiful.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    rating: 4.7,
    likes: 7890,
    comments: [
      { id: 'fc8', author: 'Priyanka_C', text: 'So evocative!', timestamp: '3h ago' },
      { id: 'fc9', author: 'Irrfan_K', text: 'Beautiful blend.', timestamp: '5h ago' },
    ],
    recipe: [{ name: 'Petrichor', percentage: 45 }, { name: 'Jasmine', percentage: 35 }, { name: 'Sandalwood', percentage: 20 }],
    timestamp: '1d ago',
  },
];

// Generate remix blend from a recipe
const generateRemixBlend = (recipe: { name: string; percentage: number }[]) => {
  const baseMap: Record<string, string> = {
    'Rose': 'floral', 'Jasmine': 'floral', 'Lily': 'floral', 'Orchid': 'floral', 'Peony': 'floral', 'Freesia': 'floral', 'Gardenia': 'floral', 'Tuberose': 'floral', 'Iris': 'floral', 'Violet': 'floral', 'Sakura': 'floral', 'Cherry': 'floral', 'Heather': 'floral',
    'Oud': 'oriental', 'Amber': 'oriental', 'Saffron': 'oriental', 'Frankincense': 'oriental', 'Myrrh': 'oriental', 'Incense': 'oriental', 'Spice': 'oriental',
    'Cedar': 'woody', 'Sandalwood': 'woody', 'Pine': 'woody', 'Patchouli': 'woody', 'Vetiver': 'woody', 'Oak': 'woody', 'Mahogany': 'woody', 'Maple': 'woody', 'Peat': 'woody', 'Moss': 'woody',
    'Citrus': 'citrus', 'Lemon': 'citrus', 'Bergamot': 'citrus', 'Lime': 'citrus', 'Orange': 'citrus', 'Grapefruit': 'citrus', 'Mandarin': 'citrus',
    'Musk': 'musk', 'Vanilla': 'musk', 'Ambergris': 'musk', 'Cashmeran': 'musk',
  };
  
  const blend: Record<string, number> = { floral: 0, woody: 0, citrus: 0, musk: 0, oriental: 0 };
  
  recipe.forEach(item => {
    const base = baseMap[item.name] || 'floral';
    blend[base] += item.percentage;
  });
  
  // Add random variation
  const bases = Object.keys(blend);
  bases.forEach(base => {
    if (blend[base] > 0) {
      const variation = Math.floor(Math.random() * 20) - 10;
      blend[base] = Math.max(10, blend[base] + variation);
    }
  });
  
  // Normalize to 100
  const total = Object.values(blend).reduce((a, b) => a + b, 0);
  if (total > 0) {
    bases.forEach(base => {
      blend[base] = Math.round((blend[base] / total) * 100 / 5) * 5;
    });
  }
  
  return blend;
};

export default function CommunityPage({ onNavigate }: CommunityPageProps) {
  const { likePost, addComment } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('trending');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null);

  const getPostsForTab = useCallback((tab: TabType): Post[] => {
    switch (tab) {
      case 'trending':
        return trendingPosts;
      case 'new':
        return newPosts;
      case 'following':
        return followingPosts;
      default:
        return trendingPosts;
    }
  }, []);

  const handleLike = (postId: string) => {
    likePost(postId);
  };

  const handleSubmitComment = (postId: string) => {
    if (commentText.trim()) {
      addComment(postId, {
        author: 'Camille',
        text: commentText.trim(),
      });
      setCommentText('');
    }
  };

  const handleRate = (postId: string, rating: number) => {
    setUserRatings(prev => ({ ...prev, [postId]: rating }));
    setShowRatingModal(null);
  };

  const handleRemix = (post: Post) => {
    const blend = generateRemixBlend(post.recipe);
    
    // Store the blend in localStorage for the MixingLab to pick up
    localStorage.setItem('remixBlend', JSON.stringify({
      id: 'current',
      name: `${post.title} (Remix)`,
      ...blend,
    }));
    localStorage.setItem('remixSuggestion', `Remixed from ${post.title} by @${post.author}: ${blend.floral}% Floral, ${blend.woody}% Woody, ${blend.citrus}% Citrus, ${blend.musk}% Musk, ${blend.oriental}% Oriental`);
    
    // Navigate to mixing lab
    onNavigate('mixing-lab');
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'trending', label: 'Trending' },
    { key: 'new', label: 'New' },
    { key: 'following', label: 'Following' },
  ];

  return (
    <div className="min-h-screen p-5 pb-28">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-serif text-white text-center mb-4">Community</h1>
        
        {/* Tabs */}
        <div className="flex justify-center gap-6 relative">
          {tabs.map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-2 text-sm font-medium transition-colors ${
                activeTab === tab.key ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Posts */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {getPostsForTab(activeTab).map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              isExpanded={expandedPost === post.id}
              onExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              onLike={() => handleLike(post.id)}
              onRate={() => setShowRatingModal(post.id)}
              onRemix={() => handleRemix(post)}
              userRating={userRatings[post.id]}
              commentText={commentText}
              setCommentText={setCommentText}
              onSubmitComment={() => handleSubmitComment(post.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5"
            onClick={() => setShowRatingModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 w-full max-w-xs"
            >
              <h3 className="text-white text-lg font-medium mb-4 text-center">Rate this blend</h3>
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRate(showRatingModal, star)}
                    className="text-2xl"
                  >
                    <Star size={28} className="text-amber-400" fill="currentColor" />
                  </motion.button>
                ))}
              </div>
              <p className="text-slate-400 text-xs text-center">Tap a star to rate</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PostCardProps {
  post: Post;
  index: number;
  isExpanded: boolean;
  onExpand: () => void;
  onLike: () => void;
  onRate: () => void;
  onRemix: () => void;
  userRating?: number;
  commentText: string;
  setCommentText: (text: string) => void;
  onSubmitComment: () => void;
}

function PostCard({ post, index, isExpanded, onExpand, onLike, onRate, onRemix, userRating, commentText, setCommentText, onSubmitComment }: PostCardProps) {
  const displayRating = userRating || post.rating;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Post Image */}
      <div className="relative aspect-video">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        
        {/* Master Blender Badge */}
        {post.isMasterBlender && (
          <div className="absolute top-3 right-3 bg-amber-400/90 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <span>🏆</span>
            Master Blender
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-serif text-white">{post.title}</h3>
          <button 
            onClick={onRate}
            className="flex items-center gap-1 text-amber-400 hover:scale-110 transition-transform"
          >
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-medium">{displayRating}</span>
            {userRating && <span className="text-[10px] text-green-400 ml-1">✓</span>}
          </button>
        </div>

        {/* Author */}
        <p className="text-slate-400 text-sm mb-3">
          by <span className="text-amber-400">@{post.author}</span> · {post.location}
        </p>

        {/* Description */}
        <p className="text-slate-300 text-sm mb-3">{post.description}</p>

        {/* Recipe Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.recipe.map((item, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 rounded-full glass text-slate-300"
            >
              {item.name} {item.percentage}%
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onLike}
            className="flex-1 py-2.5 rounded-xl glass flex items-center justify-center gap-2 text-slate-300 hover:text-amber-400 transition-colors"
          >
            <ArrowUp size={16} />
            <span className="text-sm">Upvote</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onRemix}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-semibold flex items-center justify-center gap-2"
          >
            <GitBranch size={16} />
            <span className="text-sm">Remix</span>
          </motion.button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-slate-400 text-sm mb-3">
          <button 
            onClick={onExpand}
            className="flex items-center gap-1 hover:text-amber-400 transition-colors"
          >
            <Heart size={14} />
            {post.likes}
          </button>
          <button 
            onClick={onExpand}
            className="flex items-center gap-1 hover:text-amber-400 transition-colors"
          >
            <MessageCircle size={14} />
            {post.comments.length}
          </button>
          <span className="ml-auto text-xs">{post.timestamp}</span>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-700 pt-3 mt-3">
                {/* Comment Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500"
                    onKeyPress={(e) => e.key === 'Enter' && onSubmitComment()}
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onSubmitComment}
                    className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center"
                  >
                    <Send size={14} className="text-slate-900" />
                  </motion.button>
                </div>

                {/* Comments List */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {post.comments.map((comment, i) => (
                    <motion.div
                      key={comment.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-amber-400">
                          {comment.author[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400">
                          <span className="text-amber-400">@{comment.author}</span> · {comment.timestamp}
                        </p>
                        <p className="text-sm text-slate-300">{comment.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

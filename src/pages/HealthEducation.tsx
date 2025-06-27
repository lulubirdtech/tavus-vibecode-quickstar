import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users,
  Heart,
  Brain,
  Leaf,
  Shield,
  Apple,
  Activity,
  Sun,
  Droplets,
  Search,
  Filter,
  Eye,
  Loader,
  ShoppingCart
} from 'lucide-react';
import { aiService } from '../services/aiService';
import PurchaseModal from '../components/PurchaseModal';

const HealthEducation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [generatedArticle, setGeneratedArticle] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'nutrition', name: 'Nutrition', icon: Apple },
    { id: 'prevention', name: 'Prevention', icon: Shield },
    { id: 'wellness', name: 'Wellness', icon: Heart },
    { id: 'natural', name: 'Natural Health', icon: Leaf },
  ];

  const educationContent = [
    {
      id: 1,
      title: 'Understanding Common Cold: Prevention & Natural Treatment',
      category: 'prevention',
      type: 'article',
      duration: '8 min read',
      difficulty: 'Beginner',
      description: 'Learn how to prevent common cold and treat it naturally with proven home remedies.',
      topics: ['Immune system', 'Natural remedies', 'Prevention tips', 'Nutrition'],
      aiTopic: 'common cold prevention and natural treatment methods'
    },
    {
      id: 2,
      title: 'Nutrition for Optimal Health: A Complete Guide',
      category: 'nutrition',
      type: 'guide',
      duration: '15 min read',
      difficulty: 'Intermediate',
      description: 'Comprehensive guide to nutrition principles for maintaining optimal health and preventing diseases.',
      topics: ['Balanced diet', 'Vitamins', 'Minerals', 'Meal planning'],
      aiTopic: 'optimal nutrition for health and disease prevention'
    },
    {
      id: 3,
      title: 'Mental Health & Stress Management Naturally',
      category: 'wellness',
      type: 'video',
      duration: '12 min watch',
      difficulty: 'Beginner',
      description: 'Natural approaches to managing stress and maintaining mental health without medications.',
      topics: ['Stress relief', 'Meditation', 'Natural remedies', 'Lifestyle'],
      aiTopic: 'natural stress management and mental health techniques'
    },
    {
      id: 4,
      title: 'Digestive Health: Foods That Heal Your Gut',
      category: 'nutrition',
      type: 'article',
      duration: '10 min read',
      difficulty: 'Intermediate',
      description: 'Discover foods and natural remedies that promote digestive health and heal gut problems.',
      topics: ['Gut health', 'Probiotics', 'Digestive enzymes', 'Natural healing'],
      aiTopic: 'digestive health and gut healing foods'
    },
    {
      id: 5,
      title: 'Skin Health: Natural Remedies for Common Skin Problems',
      category: 'natural',
      type: 'guide',
      duration: '12 min read',
      difficulty: 'Beginner',
      description: 'Natural treatments for acne, eczema, and other common skin conditions using herbs and foods.',
      topics: ['Skin care', 'Natural remedies', 'Herbal medicine', 'Nutrition'],
      aiTopic: 'natural skin health and remedies for common skin conditions'
    },
    {
      id: 6,
      title: 'Immune System Boosting: Natural Ways to Stay Healthy',
      category: 'prevention',
      type: 'article',
      duration: '9 min read',
      difficulty: 'Beginner',
      description: 'Strengthen your immune system naturally with foods, herbs, and lifestyle practices.',
      topics: ['Immunity', 'Prevention', 'Natural supplements', 'Lifestyle'],
      aiTopic: 'natural immune system boosting methods and foods'
    },
    {
      id: 7,
      title: 'Heart Health: Natural Approaches to Cardiovascular Wellness',
      category: 'wellness',
      type: 'article',
      duration: '11 min read',
      difficulty: 'Intermediate',
      description: 'Comprehensive guide to maintaining heart health through natural methods and lifestyle changes.',
      topics: ['Cardiovascular health', 'Exercise', 'Diet', 'Natural supplements'],
      aiTopic: 'natural heart health and cardiovascular wellness strategies'
    },
    {
      id: 8,
      title: 'Sleep Optimization: Natural Ways to Improve Sleep Quality',
      category: 'wellness',
      type: 'guide',
      duration: '10 min read',
      difficulty: 'Beginner',
      description: 'Learn natural techniques to improve sleep quality and overcome insomnia without medications.',
      topics: ['Sleep hygiene', 'Natural remedies', 'Relaxation', 'Lifestyle'],
      aiTopic: 'natural sleep improvement and insomnia remedies'
    }
  ];

  const filteredContent = educationContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100 border-green-300';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'Advanced': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'guide': return BookOpen;
      default: return BookOpen;
    }
  };

  const handleReadFullArticle = async (content: any) => {
    setIsGenerating(true);
    setError(null);
    setSelectedArticle(content);

    try {
      if (aiService.isConfigured()) {
        const article = await aiService.generateHealthArticle(content.aiTopic);
        setGeneratedArticle(article);
      } else {
        // Demo content
        setTimeout(() => {
          setGeneratedArticle({
            title: content.title,
            overview: `This comprehensive guide covers ${content.aiTopic} with evidence-based information and practical advice. Understanding the fundamentals of this topic is essential for maintaining optimal health and preventing related health issues. This article provides actionable insights that you can implement immediately to improve your health outcomes.`,
            keyPoints: [
              "Understanding the scientific basis and mechanisms involved",
              "Recognizing early signs and symptoms to watch for",
              "Implementing evidence-based lifestyle modifications",
              "Exploring safe and effective natural treatment options",
              "Developing sustainable prevention strategies",
              "Creating a personalized long-term health management plan"
            ],
            naturalTreatments: [
              "Targeted dietary modifications and nutritional interventions",
              "Evidence-based herbal remedies and natural supplements",
              "Physical therapy and movement-based approaches",
              "Stress management and mindfulness techniques",
              "Sleep optimization and circadian rhythm support"
            ],
            evidence: "Recent clinical studies and meta-analyses support the effectiveness of natural approaches when combined with conventional medical care. Research shows significant improvements in health outcomes when patients adopt comprehensive natural health strategies.",
            prevention: [
              "Regular health screenings and preventive care",
              "Maintaining a balanced, nutrient-dense diet",
              "Engaging in regular physical activity and exercise",
              "Implementing effective stress management techniques",
              "Ensuring adequate sleep and recovery"
            ],
            seekHelp: "Seek immediate medical attention if symptoms are severe, persistent, or worsening. Always consult with healthcare professionals before making significant changes to your health regimen, especially if you have existing medical conditions or take medications."
          });
          setIsGenerating(false);
        }, 2500);
        return;
      }
    } catch (error: any) {
      console.error('Article generation failed:', error);
      setError(error.message || 'Failed to generate article');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Education Center</h1>
        <p className="text-gray-600">Learn about natural health, nutrition, and wellness through our comprehensive educational resources.</p>
        {!aiService.isConfigured() && (
          <div className="mt-2 p-3 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Configure API keys in Settings → AI Configuration for personalized AI-generated health articles.
            </p>
          </div>
        )}
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search health topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors backdrop-blur-sm text-gray-800 placeholder:text-gray-500"
            />
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-medical-primary/20 text-medical-primary border-2 border-medical-primary/30'
                    : 'bg-white/50 text-gray-700 border-2 border-white/30 hover:bg-white/70'
                }`}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Generated Article */}
      {generatedArticle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {aiService.isConfigured() ? 'AI-Generated Article' : 'Demo Article'}: {generatedArticle.title}
            </h2>
            <button
              onClick={() => setGeneratedArticle(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 border-2 border-blue-300">
              <h3 className="font-semibold text-gray-800 mb-3">Overview</h3>
              <p className="text-gray-700 leading-relaxed">{generatedArticle.overview}</p>
            </div>

            {/* Key Points */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                Key Points
              </h3>
              <ul className="space-y-2">
                {generatedArticle.keyPoints.map((point: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Natural Treatments */}
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 border-2 border-orange-300">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-orange-600" />
                Natural Treatments
              </h3>
              <ul className="space-y-2">
                {generatedArticle.naturalTreatments.map((treatment: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {treatment}
                  </li>
                ))}
              </ul>
            </div>

            {/* Scientific Evidence */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-300">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                Scientific Evidence
              </h3>
              <p className="text-gray-700 leading-relaxed">{generatedArticle.evidence}</p>
            </div>

            {/* Prevention Strategies */}
            <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl p-4 border-2 border-cyan-300">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-cyan-600" />
                Prevention Strategies
              </h3>
              <ul className="space-y-2">
                {generatedArticle.prevention.map((strategy: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>

            {/* When to Seek Help */}
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-4 border-2 border-red-300">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-600" />
                When to Seek Medical Help
              </h3>
              <p className="text-gray-700 leading-relaxed">{generatedArticle.seekHelp}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-green-glow transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Recommended Items
            </button>
          </div>
        </motion.div>
      )}

      {/* Featured Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="backdrop-blur-md bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Featured: Daily Health Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start p-4 bg-white/50 rounded-xl border-2 border-white/30">
            <Sun className="h-5 w-5 text-yellow-500 mr-3 mt-1" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Morning Routine</h3>
              <p className="text-sm text-gray-600">Start your day with warm lemon water and 10 minutes of stretching</p>
            </div>
          </div>
          <div className="flex items-start p-4 bg-white/50 rounded-xl border-2 border-white/30">
            <Apple className="h-5 w-5 text-red-500 mr-3 mt-1" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Nutrition Tip</h3>
              <p className="text-sm text-gray-600">Eat the rainbow - include 5 different colored fruits/vegetables daily</p>
            </div>
          </div>
          <div className="flex items-start p-4 bg-white/50 rounded-xl border-2 border-white/30">
            <Droplets className="h-5 w-5 text-blue-500 mr-3 mt-1" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Hydration</h3>
              <p className="text-sm text-gray-600">Drink water before you feel thirsty - aim for clear, pale yellow urine</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContent.map((content, index) => {
          const TypeIcon = getTypeIcon(content.type);
          return (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical hover:shadow-green-glow transition-all duration-300 cursor-pointer p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gradient-to-br from-medical-primary to-medical-secondary rounded-lg">
                    <TypeIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{content.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{content.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border-2 ${getDifficultyColor(content.difficulty)}`}>
                  {content.difficulty}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {content.duration}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="h-3 w-3 mr-1" />
                  {content.type}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Topics Covered:</h4>
                <div className="flex flex-wrap gap-2">
                  {content.topics.map((topic, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-300">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => handleReadFullArticle(content)}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-2 px-4 rounded-xl font-medium hover:shadow-green-glow transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {isGenerating && selectedArticle?.id === content.id ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Generating...
                    </>
                  ) : (
                    'Read Full Article'
                  )}
                </button>
                <button className="flex-1 bg-white/70 hover:bg-white/90 border-2 border-medical-primary/30 text-gray-800 py-2 px-4 rounded-xl font-medium transition-colors">
                  Save for Later
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {error && (
        <div className="p-4 bg-red-100 border-2 border-red-300 rounded-xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {filteredContent.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500">No educational content found matching your criteria</p>
        </motion.div>
      )}
      
      <PurchaseModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        recommendedItems={generatedArticle?.naturalTreatments || []}
      />
    </div>
  );
};

export default HealthEducation;
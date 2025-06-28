import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Briefcase, 
  Code, 
  Palette, 
  Camera, 
  MessageSquare,
  Search,
  Star,
  Copy,
  Plus,
  X
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'business' | 'creative' | 'technical' | 'academic' | 'social' | 'image' | 'video';
  enhancementType: 'detailed' | 'creative' | 'technical' | 'concise' | 'image' | 'video';
  tags: string[];
  isFavorite?: boolean;
}

interface PromptTemplatesProps {
  onSelectTemplate: (template: Template) => void;
  isOpen: boolean;
  onClose: () => void;
}

const templates: Template[] = [
  // Business Templates
  {
    id: 'business-email',
    title: 'Email Profissional',
    description: 'Template para emails corporativos formais',
    prompt: 'Escreva um email profissional para [destinatário] sobre [assunto], incluindo [pontos principais]',
    category: 'business',
    enhancementType: 'detailed',
    tags: ['email', 'corporativo', 'formal']
  },
  {
    id: 'marketing-strategy',
    title: 'Estratégia de Marketing',
    description: 'Desenvolva estratégias de marketing completas',
    prompt: 'Crie uma estratégia de marketing para [produto/serviço] focando em [público-alvo] com orçamento de [valor]',
    category: 'business',
    enhancementType: 'detailed',
    tags: ['marketing', 'estratégia', 'negócios']
  },
  
  // Creative Templates
  {
    id: 'story-writing',
    title: 'Escrita Criativa',
    description: 'Para histórias, narrativas e conteúdo criativo',
    prompt: 'Escreva uma história sobre [tema] com personagem principal [descrição] em um cenário [ambiente]',
    category: 'creative',
    enhancementType: 'creative',
    tags: ['história', 'narrativa', 'criativo']
  },
  {
    id: 'social-media-post',
    title: 'Post para Redes Sociais',
    description: 'Conteúdo envolvente para redes sociais',
    prompt: 'Crie um post para [plataforma] sobre [tópico] que seja [tom desejado] e inclua [call-to-action]',
    category: 'social',
    enhancementType: 'creative',
    tags: ['social media', 'engajamento', 'post']
  },
  
  // Technical Templates
  {
    id: 'code-documentation',
    title: 'Documentação Técnica',
    description: 'Documentação clara para código e APIs',
    prompt: 'Documente a função/API [nome] que [funcionalidade] com parâmetros [lista] e retorna [tipo]',
    category: 'technical',
    enhancementType: 'technical',
    tags: ['documentação', 'código', 'API']
  },
  {
    id: 'bug-report',
    title: 'Relatório de Bug',
    description: 'Template para reportar problemas técnicos',
    prompt: 'Reporte um bug em [sistema] onde [comportamento esperado] mas [comportamento atual] ocorre quando [passos]',
    category: 'technical',
    enhancementType: 'technical',
    tags: ['bug', 'relatório', 'técnico']
  },
  
  // Image Templates
  {
    id: 'product-photo',
    title: 'Foto de Produto',
    description: 'Prompts para fotografias comerciais',
    prompt: 'Foto profissional de [produto] em [ambiente] com [estilo de iluminação] e [ângulo]',
    category: 'image',
    enhancementType: 'image',
    tags: ['produto', 'fotografia', 'comercial']
  },
  {
    id: 'artistic-portrait',
    title: 'Retrato Artístico',
    description: 'Retratos com estilo artístico único',
    prompt: 'Retrato artístico de [pessoa] no estilo [artista/movimento] com [elementos visuais] e [atmosfera]',
    category: 'image',
    enhancementType: 'image',
    tags: ['retrato', 'artístico', 'estilo']
  },
  
  // Video Templates
  {
    id: 'tutorial-video',
    title: 'Vídeo Tutorial',
    description: 'Scripts para vídeos educacionais',
    prompt: 'Tutorial em vídeo mostrando como [ação] passo a passo com [duração] e [estilo visual]',
    category: 'video',
    enhancementType: 'video',
    tags: ['tutorial', 'educacional', 'passo-a-passo']
  },
  {
    id: 'promotional-video',
    title: 'Vídeo Promocional',
    description: 'Vídeos para marketing e promoção',
    prompt: 'Vídeo promocional de [produto/serviço] destacando [benefícios] com [tom] e duração de [tempo]',
    category: 'video',
    enhancementType: 'video',
    tags: ['promocional', 'marketing', 'comercial']
  }
];

const categoryIcons = {
  business: Briefcase,
  creative: Palette,
  technical: Code,
  academic: BookOpen,
  social: MessageSquare,
  image: Camera,
  video: Camera
};

const categoryColors = {
  business: 'from-blue-500 to-cyan-500',
  creative: 'from-purple-500 to-pink-500',
  technical: 'from-green-500 to-emerald-500',
  academic: 'from-orange-500 to-red-500',
  social: 'from-pink-500 to-rose-500',
  image: 'from-indigo-500 to-purple-500',
  video: 'from-violet-500 to-purple-600'
};

export const PromptTemplates: React.FC<PromptTemplatesProps> = ({
  onSelectTemplate,
  isOpen,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', label: 'Todos', icon: BookOpen },
    { id: 'business', label: 'Negócios', icon: Briefcase },
    { id: 'creative', label: 'Criativo', icon: Palette },
    { id: 'technical', label: 'Técnico', icon: Code },
    { id: 'social', label: 'Social', icon: MessageSquare },
    { id: 'image', label: 'Imagem', icon: Camera },
    { id: 'video', label: 'Vídeo', icon: Camera }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="fixed inset-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Templates de Prompt</h2>
                <p className="text-purple-100">Acelere sua criação com templates prontos</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Categories */}
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => {
                  const CategoryIcon = categoryIcons[template.category];
                  const categoryColor = categoryColors[template.category];
                  
                  return (
                    <motion.div
                      key={template.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${categoryColor}`}>
                          <CategoryIcon className="h-4 w-4 text-white" />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(template.id);
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Star 
                            className={`h-4 w-4 ${
                              favorites.has(template.id) 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-400'
                            }`} 
                          />
                        </button>
                      </div>

                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {template.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {template.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium bg-gradient-to-r ${categoryColor} text-white`}>
                          {template.enhancementType}
                        </span>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(template.prompt);
                            }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title="Copiar template"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title="Usar template"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum template encontrado
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
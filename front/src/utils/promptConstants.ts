import { Type, Code, Lightbulb, Target, Eye, Brush, Heart, ShoppingBag, Film, FileText, Play, Store, Palette, Camera, Wand2, Scissors } from 'lucide-react';
import React from 'react';

export const enhancementTypes = [
  // Text Types
  { 
    id: 'detailed' as const, 
    label: 'Detalhado', 
    icon: Type, 
    color: 'from-blue-500 to-cyan-500',
    description: 'Cria prompts abrangentes com instruções passo a passo e contexto detalhado',
    category: 'text'
  },
  { 
    id: 'creative' as const, 
    label: 'Criativo', 
    icon: Lightbulb, 
    color: 'from-purple-500 to-pink-500',
    description: 'Gera prompts inovadores que estimulam pensamento criativo e soluções originais',
    category: 'text'
  },
  { 
    id: 'technical' as const, 
    label: 'Técnico', 
    icon: Code, 
    color: 'from-green-500 to-emerald-500',
    description: 'Produz prompts técnicos precisos com especificações e melhores práticas',
    category: 'text'
  },
  { 
    id: 'concise' as const, 
    label: 'Conciso', 
    icon: Target, 
    color: 'from-orange-500 to-red-500',
    description: 'Cria prompts diretos e objetivos focados em resultados imediatos',
    category: 'text'
  },
  
  // Image Types
  { 
    id: 'image-realistic' as const, 
    label: 'Realista', 
    icon: Eye, 
    color: 'from-blue-600 to-indigo-600',
    description: 'Prompts para imagens fotorrealistas com detalhes precisos e iluminação natural',
    category: 'image'
  },
  { 
    id: 'image-artistic' as const, 
    label: 'Artístico', 
    icon: Brush, 
    color: 'from-purple-600 to-pink-600',
    description: 'Prompts para arte digital, pinturas e estilos artísticos únicos',
    category: 'image'
  },
  { 
    id: 'image-anime' as const, 
    label: 'Desenho/Anime', 
    icon: Heart, 
    color: 'from-pink-500 to-rose-500',
    description: 'Prompts para estilo anime, manga, desenho animado e ilustrações japonesas',
    category: 'image'
  },
  { 
    id: 'image-commercial' as const, 
    label: 'Comercial', 
    icon: ShoppingBag, 
    color: 'from-orange-600 to-red-600',
    description: 'Prompts para fotografia de produto, marketing e uso comercial',
    category: 'image'
  },
  
  // Video Types
  { 
    id: 'video-cinematic' as const, 
    label: 'Cinematográfico', 
    icon: Film, 
    color: 'from-slate-600 to-gray-700',
    description: 'Prompts para vídeos com qualidade cinematográfica e narrativa visual',
    category: 'video'
  },
  { 
    id: 'video-documentary' as const, 
    label: 'Documentário', 
    icon: FileText, 
    color: 'from-blue-700 to-indigo-700',
    description: 'Prompts para vídeos informativos, educacionais e documentários',
    category: 'video'
  },
  { 
    id: 'video-animated' as const, 
    label: 'Animado', 
    icon: Play, 
    color: 'from-purple-700 to-pink-700',
    description: 'Prompts para animações, motion graphics e conteúdo animado',
    category: 'video'
  },
  { 
    id: 'video-commercial' as const, 
    label: 'Comercial', 
    icon: Store, 
    color: 'from-green-700 to-emerald-700',
    description: 'Prompts para vídeos promocionais, publicitários e de marketing',
    category: 'video'
  },
  
  // Editing Types
  { 
    id: 'image-editing' as const, 
    label: 'Edição de Imagem com IA', 
    icon: Wand2, 
    color: 'from-emerald-500 to-teal-500',
    description: 'Prompts para IAs de edição de imagem como Photoshop AI, Canva AI, Remove.bg',
    category: 'editing'
  },
  { 
    id: 'video-editing' as const, 
    label: 'Edição de Vídeo com IA', 
    icon: Scissors, 
    color: 'from-violet-500 to-indigo-600',
    description: 'Prompts para IAs de edição de vídeo como RunwayML, Kapwing AI, Descript',
    category: 'editing'
  }
];

export const categoryLabels = {
  text: 'Texto',
  image: 'Geração de Imagem',
  video: 'Geração de Vídeo',
  editing: 'Edição com IA'
};

export const categoryIcons = {
  text: Type,
  image: Palette,
  video: Camera,
  editing: Wand2
};

export const typeIcons = {
  detailed: Type,
  creative: Lightbulb,
  technical: Code,
  concise: Target,
  'image-realistic': Eye,
  'image-artistic': Brush,
  'image-anime': Heart,
  'image-commercial': ShoppingBag,
  'video-cinematic': Film,
  'video-documentary': FileText,
  'video-animated': Play,
  'video-commercial': Store,
  'image-editing': Wand2,
  'video-editing': Scissors
};

export const typeColors = {
  detailed: 'from-blue-500 to-cyan-500',
  creative: 'from-purple-500 to-pink-500',
  technical: 'from-green-500 to-emerald-500',
  concise: 'from-orange-500 to-red-500',
  'image-realistic': 'from-blue-600 to-indigo-600',
  'image-artistic': 'from-purple-600 to-pink-600',
  'image-anime': 'from-pink-500 to-rose-500',
  'image-commercial': 'from-orange-600 to-red-600',
  'video-cinematic': 'from-slate-600 to-gray-700',
  'video-documentary': 'from-blue-700 to-indigo-700',
  'video-animated': 'from-purple-700 to-pink-700',
  'video-commercial': 'from-green-700 to-emerald-700',
  'image-editing': 'from-emerald-500 to-teal-500',
  'video-editing': 'from-violet-500 to-indigo-600'
};

export const typeLabels = {
  detailed: 'Detalhado',
  creative: 'Criativo',
  technical: 'Técnico',
  concise: 'Conciso',
  'image-realistic': 'Imagem Realista',
  'image-artistic': 'Imagem Artística',
  'image-anime': 'Imagem Anime/Desenho',
  'image-commercial': 'Imagem Comercial',
  'video-cinematic': 'Vídeo Cinematográfico',
  'video-documentary': 'Vídeo Documentário',
  'video-animated': 'Vídeo Animado',
  'video-commercial': 'Vídeo Comercial',
  'image-editing': 'Edição de Imagem com IA',
  'video-editing': 'Edição de Vídeo com IA'
};

export const typeDescriptions = {
  detailed: 'Prompt detalhado e abrangente',
  creative: 'Prompt criativo e inovador',
  technical: 'Prompt técnico e preciso',
  concise: 'Prompt direto e objetivo',
  'image-realistic': 'Otimizado para imagens fotorrealistas',
  'image-artistic': 'Especializado em arte digital e estilos artísticos',
  'image-anime': 'Focado em estilo anime, manga e desenho japonês',
  'image-commercial': 'Direcionado para uso comercial e marketing',
  'video-cinematic': 'Qualidade cinematográfica com narrativa visual',
  'video-documentary': 'Estilo documental informativo e educacional',
  'video-animated': 'Animações e motion graphics dinâmicos',
  'video-commercial': 'Conteúdo promocional e publicitário',
  'image-editing': 'Comandos para IA de edição de imagens',
  'video-editing': 'Comandos para IA de edição de vídeos'
};
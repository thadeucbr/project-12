import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Grid, 
  List,
  FolderPlus,
  Tag,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Collection, Prompt } from '../types';

interface CollectionsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onPromptSelect?: (prompt: Prompt) => void;
}

const collectionColors = [
  'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
];

const collectionIcons = [
  '📁', '🎨', '💼', '🔬', '📚', '🎯', '⚡', '🌟', '🚀', '💡'
];

export const CollectionsManager: React.FC<CollectionsManagerProps> = ({
  isOpen,
  onClose,
  onPromptSelect
}) => {
  const { state, addCollection, updateCollection, deleteCollection, addToCollection, removeFromCollection } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: collectionColors[0],
    icon: collectionIcons[0],
    isPublic: false
  });

  const filteredCollections = state.collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) return;

    const collection: Collection = {
      id: crypto.randomUUID(),
      name: newCollection.name,
      description: newCollection.description,
      color: newCollection.color,
      icon: newCollection.icon,
      promptIds: [],
      isPublic: newCollection.isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    };

    addCollection(collection);
    setNewCollection({
      name: '',
      description: '',
      color: collectionColors[0],
      icon: collectionIcons[0],
      isPublic: false
    });
    setShowCreateForm(false);
  };

  const handleUpdateCollection = () => {
    if (!editingCollection || !newCollection.name.trim()) return;

    updateCollection(editingCollection.id, {
      name: newCollection.name,
      description: newCollection.description,
      color: newCollection.color,
      icon: newCollection.icon,
      isPublic: newCollection.isPublic
    });

    setEditingCollection(null);
    setNewCollection({
      name: '',
      description: '',
      color: collectionColors[0],
      icon: collectionIcons[0],
      isPublic: false
    });
  };

  const startEditing = (collection: Collection) => {
    setEditingCollection(collection);
    setNewCollection({
      name: collection.name,
      description: collection.description,
      color: collection.color,
      icon: collection.icon,
      isPublic: collection.isPublic
    });
    setShowCreateForm(true);
  };

  const getCollectionPrompts = (collectionId: string) => {
    return state.prompts.filter(prompt => prompt.collectionId === collectionId);
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
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folder className="h-8 w-8" />
                <div>
                  <h2 className="text-2xl font-bold">Coleções</h2>
                  <p className="text-indigo-100">{state.collections.length} coleções criadas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Nova Coleção
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-full">
            {/* Sidebar - Collections List */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-4">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar coleções..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Collections List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCollections.map((collection) => (
                  <motion.div
                    key={collection.id}
                    layout
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCollection === collection.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedCollection(collection.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${collection.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {collection.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {collection.promptIds.length} prompts
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(collection);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Tem certeza que deseja excluir esta coleção?')) {
                              deleteCollection(collection.id);
                              if (selectedCollection === collection.id) {
                                setSelectedCollection(null);
                              }
                            }
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {selectedCollection ? (
                <CollectionDetail
                  collection={state.collections.find(c => c.id === selectedCollection)!}
                  prompts={getCollectionPrompts(selectedCollection)}
                  onPromptSelect={onPromptSelect}
                  onRemovePrompt={(promptId) => removeFromCollection(selectedCollection, promptId)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FolderPlus className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Selecione uma coleção
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500">
                      Escolha uma coleção para ver seus prompts
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Create/Edit Collection Modal */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingCollection(null);
                  setNewCollection({
                    name: '',
                    description: '',
                    color: collectionColors[0],
                    icon: collectionIcons[0],
                    isPublic: false
                  });
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {editingCollection ? 'Editar Coleção' : 'Nova Coleção'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome</label>
                      <input
                        type="text"
                        value={newCollection.name}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Nome da coleção"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Descrição</label>
                      <textarea
                        value={newCollection.description}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Descrição da coleção"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Cor</label>
                      <div className="flex gap-2">
                        {collectionColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewCollection(prev => ({ ...prev, color }))}
                            className={`w-8 h-8 ${color} rounded-full border-2 ${
                              newCollection.color === color ? 'border-gray-800 dark:border-white' : 'border-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Ícone</label>
                      <div className="grid grid-cols-5 gap-2">
                        {collectionIcons.map((icon) => (
                          <button
                            key={icon}
                            onClick={() => setNewCollection(prev => ({ ...prev, icon }))}
                            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg ${
                              newCollection.icon === icon 
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={newCollection.isPublic}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="isPublic" className="text-sm">
                        Tornar pública (visível para outros usuários)
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingCollection(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={editingCollection ? handleUpdateCollection : handleCreateCollection}
                      className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      {editingCollection ? 'Salvar' : 'Criar'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface CollectionDetailProps {
  collection: Collection;
  prompts: Prompt[];
  onPromptSelect?: (prompt: Prompt) => void;
  onRemovePrompt: (promptId: string) => void;
}

const CollectionDetail: React.FC<CollectionDetailProps> = ({
  collection,
  prompts,
  onPromptSelect,
  onRemovePrompt
}) => {
  return (
    <div>
      {/* Collection Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 ${collection.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
          {collection.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {collection.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {collection.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{prompts.length} prompts</span>
            <span>Criada em {new Date(collection.createdAt).toLocaleDateString()}</span>
            {collection.isPublic && <span className="text-green-500">Pública</span>}
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Coleção vazia
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Adicione prompts a esta coleção para organizá-los
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {prompts.map((prompt) => (
            <motion.div
              key={prompt.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => onPromptSelect?.(prompt)}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  prompt.enhancementType === 'detailed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                  prompt.enhancementType === 'creative' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                  prompt.enhancementType === 'technical' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                }`}>
                  {prompt.enhancementType}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Remover este prompt da coleção?')) {
                      onRemovePrompt(prompt.id);
                    }
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>

              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2 line-clamp-2">
                {prompt.originalPrompt}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                {prompt.enhancedPrompt}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{new Date(prompt.timestamp).toLocaleDateString()}</span>
                <span>{prompt.characterCount} chars</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  Clock, 
  ArrowRight, 
  Copy, 
  RotateCcw, 
  Plus,
  Diff,
  Check,
  X
} from 'lucide-react';
import type { Prompt, PromptVersion } from '../types';

interface VersionManagerProps {
  prompt: Prompt;
  isOpen: boolean;
  onClose: () => void;
  onVersionSelect: (version: PromptVersion) => void;
  onCreateVersion: (content: string, changes: string) => void;
}

export const VersionManager: React.FC<VersionManagerProps> = ({
  prompt,
  isOpen,
  onClose,
  onVersionSelect,
  onCreateVersion
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newVersionContent, setNewVersionContent] = useState(prompt.enhancedPrompt);
  const [changeDescription, setChangeDescription] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  // Mock versions data - in real app, this would come from props or context
  const versions: PromptVersion[] = [
    {
      id: '1',
      promptId: prompt.id,
      version: 1,
      content: prompt.enhancedPrompt,
      changes: 'Versão inicial',
      timestamp: prompt.timestamp,
      isActive: true
    }
  ];

  const handleCreateVersion = () => {
    if (!newVersionContent.trim() || !changeDescription.trim()) return;

    onCreateVersion(newVersionContent, changeDescription);
    setNewVersionContent('');
    setChangeDescription('');
    setShowCreateForm(false);
  };

  const toggleVersionSelection = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 2) {
        return [...prev, versionId];
      } else {
        return [prev[1], versionId];
      }
    });
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
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitBranch className="h-8 w-8" />
                <div>
                  <h2 className="text-2xl font-bold">Versões do Prompt</h2>
                  <p className="text-green-100">Gerencie diferentes versões e melhorias</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    compareMode 
                      ? 'bg-white text-green-600' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  <Diff className="h-4 w-4" />
                  {compareMode ? 'Sair da Comparação' : 'Comparar'}
                </button>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Nova Versão
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

          <div className="p-6">
            {compareMode && selectedVersions.length === 2 ? (
              <VersionComparison 
                versions={versions.filter(v => selectedVersions.includes(v.id))}
              />
            ) : (
              <div className="space-y-4">
                {/* Version Timeline */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {versions.map((version, index) => (
                    <motion.div
                      key={version.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 transition-all ${
                        version.isActive 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      } ${
                        compareMode && selectedVersions.includes(version.id)
                          ? 'ring-2 ring-blue-500'
                          : ''
                      }`}
                      onClick={() => compareMode && toggleVersionSelection(version.id)}
                    >
                      {/* Version Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            version.isActive 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}>
                            v{version.version}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {version.changes}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(version.timestamp).toLocaleString()}</span>
                              {version.isActive && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                                  Ativa
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {!compareMode && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigator.clipboard.writeText(version.content)}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Copiar conteúdo"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            {!version.isActive && (
                              <button
                                onClick={() => onVersionSelect(version)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Restaurar esta versão"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        )}

                        {compareMode && (
                          <div className="flex items-center">
                            {selectedVersions.includes(version.id) && (
                              <Check className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Version Content Preview */}
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 font-mono">
                          {version.content}
                        </p>
                      </div>

                      {/* Connection Line */}
                      {index < versions.length - 1 && (
                        <div className="absolute left-6 top-full w-0.5 h-4 bg-gray-300 dark:bg-gray-600" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {compareMode && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    {selectedVersions.length === 0 && 'Selecione duas versões para comparar'}
                    {selectedVersions.length === 1 && 'Selecione mais uma versão para comparar'}
                    {selectedVersions.length === 2 && 'Comparando versões selecionadas'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Create Version Modal */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
                onClick={() => setShowCreateForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold mb-4">Criar Nova Versão</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Descrição das mudanças
                      </label>
                      <input
                        type="text"
                        value={changeDescription}
                        onChange={(e) => setChangeDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ex: Melhorou clareza e adicionou contexto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Conteúdo da nova versão
                      </label>
                      <textarea
                        value={newVersionContent}
                        onChange={(e) => setNewVersionContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                        rows={10}
                        placeholder="Cole ou edite o prompt aqui..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateVersion}
                      disabled={!newVersionContent.trim() || !changeDescription.trim()}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Criar Versão
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

interface VersionComparisonProps {
  versions: PromptVersion[];
}

const VersionComparison: React.FC<VersionComparisonProps> = ({ versions }) => {
  if (versions.length !== 2) return null;

  const [version1, version2] = versions;

  return (
    <div className="grid grid-cols-2 gap-6 h-96">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            v{version1.version}
          </div>
          <h3 className="font-semibold">{version1.changes}</h3>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 h-full overflow-y-auto">
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
            {version1.content}
          </pre>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            v{version2.version}
          </div>
          <h3 className="font-semibold">{version2.changes}</h3>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 h-full overflow-y-auto">
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
            {version2.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
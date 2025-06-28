import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  FileJson, 
  FileSpreadsheet,
  Copy,
  Check,
  X,
  Calendar,
  Filter
} from 'lucide-react';
import type { Prompt } from '../types';

interface PromptExportProps {
  prompts: Prompt[];
  isOpen: boolean;
  onClose: () => void;
}

export const PromptExport: React.FC<PromptExportProps> = ({
  prompts,
  isOpen,
  onClose
}) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'txt'>('json');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const filterPromptsByDate = (prompts: Prompt[]) => {
    if (dateRange === 'all') return prompts;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateRange) {
      case 'today':
        return prompts.filter(p => new Date(p.timestamp) >= today);
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return prompts.filter(p => new Date(p.timestamp) >= weekAgo);
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return prompts.filter(p => new Date(p.timestamp) >= monthAgo);
      default:
        return prompts;
    }
  };

  const exportToJSON = (data: Prompt[]) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalPrompts: data.length,
      prompts: includeMetadata ? data : data.map(p => ({
        originalPrompt: p.originalPrompt,
        enhancedPrompt: p.enhancedPrompt,
        enhancementType: p.enhancementType
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    return blob;
  };

  const exportToCSV = (data: Prompt[]) => {
    const headers = includeMetadata 
      ? ['ID', 'Original Prompt', 'Enhanced Prompt', 'Enhancement Type', 'Media Type', 'Character Count', 'Tags', 'Timestamp']
      : ['Original Prompt', 'Enhanced Prompt', 'Enhancement Type'];
    
    const rows = data.map(prompt => {
      const baseRow = [
        prompt.originalPrompt.replace(/"/g, '""'),
        prompt.enhancedPrompt.replace(/"/g, '""'),
        prompt.enhancementType
      ];
      
      if (includeMetadata) {
        return [
          prompt.id,
          ...baseRow,
          prompt.mediaType || 'text',
          prompt.characterCount.toString(),
          prompt.tags.join('; '),
          prompt.timestamp
        ];
      }
      
      return baseRow;
    });
    
    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return blob;
  };

  const exportToTXT = (data: Prompt[]) => {
    const content = data.map((prompt, index) => {
      let text = `=== PROMPT ${index + 1} ===\n\n`;
      text += `ORIGINAL:\n${prompt.originalPrompt}\n\n`;
      text += `ENHANCED:\n${prompt.enhancedPrompt}\n\n`;
      
      if (includeMetadata) {
        text += `TYPE: ${prompt.enhancementType}\n`;
        text += `MEDIA: ${prompt.mediaType || 'text'}\n`;
        text += `CHARACTERS: ${prompt.characterCount}\n`;
        text += `TAGS: ${prompt.tags.join(', ')}\n`;
        text += `DATE: ${new Date(prompt.timestamp).toLocaleString()}\n`;
      }
      
      text += '\n' + '='.repeat(50) + '\n\n';
      return text;
    }).join('');
    
    const header = `PROMPTCRAFT EXPORT\n`;
    const metadata = `Export Date: ${new Date().toLocaleString()}\n`;
    const summary = `Total Prompts: ${data.length}\n`;
    const separator = '='.repeat(50) + '\n\n';
    
    const fullContent = header + metadata + summary + separator + content;
    
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8;' });
    return blob;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const filteredPrompts = filterPromptsByDate(prompts);
      
      if (filteredPrompts.length === 0) {
        alert('Nenhum prompt encontrado para o período selecionado.');
        return;
      }
      
      let blob: Blob;
      let filename: string;
      
      switch (exportFormat) {
        case 'json':
          blob = exportToJSON(filteredPrompts);
          filename = `promptcraft-export-${dateRange}.json`;
          break;
        case 'csv':
          blob = exportToCSV(filteredPrompts);
          filename = `promptcraft-export-${dateRange}.csv`;
          break;
        case 'txt':
          blob = exportToTXT(filteredPrompts);
          filename = `promptcraft-export-${dateRange}.txt`;
          break;
        default:
          throw new Error('Formato não suportado');
      }
      
      // Download do arquivo
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
      
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar os dados. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const getFilteredCount = () => {
    return filterPromptsByDate(prompts).length;
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
          className="fixed inset-4 max-w-2xl mx-auto my-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Exportar Prompts</h2>
                <p className="text-green-100">Baixe seus prompts em diferentes formatos</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Format Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Formato de Exportação
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'json', label: 'JSON', icon: FileJson, desc: 'Estruturado para desenvolvedores' },
                  { id: 'csv', label: 'CSV', icon: FileSpreadsheet, desc: 'Para planilhas e análise' },
                  { id: 'txt', label: 'TXT', icon: FileText, desc: 'Texto simples legível' }
                ].map((format) => {
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.id}
                      onClick={() => setExportFormat(format.id as any)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        exportFormat === format.id
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${
                        exportFormat === format.id ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <div className="font-medium text-gray-900 dark:text-white">
                        {format.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {format.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Período
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'Todos os prompts' },
                  { id: 'today', label: 'Hoje' },
                  { id: 'week', label: 'Última semana' },
                  { id: 'month', label: 'Último mês' }
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setDateRange(range.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      dateRange === range.id
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {getFilteredCount()} prompts serão exportados
              </div>
            </div>

            {/* Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Opções
              </h3>
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Incluir metadados
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Tags, timestamps, contagem de caracteres e outras informações
                  </div>
                </div>
              </label>
            </div>

            {/* Export Button */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleExport}
                disabled={isExporting || getFilteredCount() === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-emerald-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isExporting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Download className="h-5 w-5" />
                    </motion.div>
                    Exportando...
                  </>
                ) : exportSuccess ? (
                  <>
                    <Check className="h-5 w-5" />
                    Exportado com sucesso!
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Exportar {exportFormat.toUpperCase()}
                  </>
                )}
              </motion.button>
            </div>

            {/* Preview */}
            {exportFormat && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Preview do formato {exportFormat.toUpperCase()}:
                </h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-white dark:bg-gray-900 p-3 rounded border overflow-x-auto">
                  {exportFormat === 'json' && (
                    <pre>{`{
  "exportDate": "2024-01-15T10:30:00.000Z",
  "totalPrompts": ${getFilteredCount()},
  "prompts": [
    {
      "id": "uuid-here",
      "originalPrompt": "Texto original...",
      "enhancedPrompt": "Texto aprimorado...",
      "enhancementType": "detailed",
      ${includeMetadata ? '"mediaType": "text",\n      "characterCount": 150,\n      "tags": ["tag1", "tag2"],\n      "timestamp": "2024-01-15T10:30:00.000Z"' : ''}
    }
  ]
}`}</pre>
                  )}
                  {exportFormat === 'csv' && (
                    <pre>{includeMetadata 
                      ? `"ID","Original Prompt","Enhanced Prompt","Enhancement Type","Media Type","Character Count","Tags","Timestamp"\n"uuid","Texto original...","Texto aprimorado...","detailed","text","150","tag1; tag2","2024-01-15T10:30:00.000Z"`
                      : `"Original Prompt","Enhanced Prompt","Enhancement Type"\n"Texto original...","Texto aprimorado...","detailed"`
                    }</pre>
                  )}
                  {exportFormat === 'txt' && (
                    <pre>{`PROMPTCRAFT EXPORT
Export Date: ${new Date().toLocaleString()}
Total Prompts: ${getFilteredCount()}

=== PROMPT 1 ===

ORIGINAL:
Texto original...

ENHANCED:
Texto aprimorado...

${includeMetadata ? `TYPE: detailed
MEDIA: text
CHARACTERS: 150
TAGS: tag1, tag2
DATE: ${new Date().toLocaleString()}` : ''}

==================================================`}</pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
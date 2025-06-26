import type { Prompt } from '../types';

const enhancementTemplates = {
  detailed: {
    prefix: "Create a comprehensive and detailed response that",
    modifiers: [
      "includes specific examples and actionable insights",
      "provides step-by-step guidance where applicable",
      "incorporates relevant context and background information",
      "addresses potential challenges and solutions"
    ]
  },
  creative: {
    prefix: "Generate an innovative and creative response that",
    modifiers: [
      "explores unique perspectives and unconventional approaches",
      "incorporates storytelling elements where appropriate",
      "uses vivid imagery and engaging language",
      "thinks outside the box while maintaining relevance"
    ]
  },
  technical: {
    prefix: "Provide a precise and technically accurate response that",
    modifiers: [
      "includes relevant technical specifications and standards",
      "cites authoritative sources and best practices",
      "offers implementation details and code examples",
      "addresses scalability and performance considerations"
    ]
  },
  concise: {
    prefix: "Deliver a clear and concise response that",
    modifiers: [
      "focuses on the most essential information",
      "uses bullet points or numbered lists for clarity",
      "eliminates unnecessary details while maintaining completeness",
      "provides immediate actionable value"
    ]
  }
};

export const enhancePrompt = (
  originalPrompt: string,
  enhancementType: Prompt['enhancementType'] = 'detailed'
): string => {
  if (!originalPrompt.trim()) return '';

  const template = enhancementTemplates[enhancementType];
  const selectedModifiers = template.modifiers
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  const enhancedPrompt = `${template.prefix} ${originalPrompt.toLowerCase()}. 

Ensure your response ${selectedModifiers.join(' and ')}.

Additional Context: ${originalPrompt}`;

  return enhancedPrompt;
};

export const generateTags = (prompt: string): string[] => {
  const tagMap: Record<string, string[]> = {
    'write|writing|content|blog|article': ['writing', 'content'],
    'code|programming|develop|function|api': ['coding', 'development'],
    'design|ui|ux|interface|visual': ['design', 'ui-ux'],
    'marketing|advertis|campaign|brand': ['marketing', 'business'],
    'data|analysis|chart|graph|statistic': ['data', 'analytics'],
    'email|message|communication|letter': ['communication', 'email'],
    'research|study|investigation|analysis': ['research', 'academic'],
    'creative|story|narrative|fiction': ['creative', 'storytelling'],
    'technical|specification|documentation': ['technical', 'documentation'],
    'strategy|plan|roadmap|goal': ['strategy', 'planning']
  };

  const tags: string[] = [];
  const lowerPrompt = prompt.toLowerCase();

  Object.entries(tagMap).forEach(([pattern, tagList]) => {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(lowerPrompt)) {
      tags.push(...tagList);
    }
  });

  return [...new Set(tags)];
};
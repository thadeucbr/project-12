interface ApiResponse {
  enhancedPrompt: string;
  success: boolean;
  error?: string;
}

class ApiError extends Error {
  status?: number;

  constructor({ message, status }: { message: string; status?: number }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

class PromptEnhancementService {
  private baseUrl: string;
  private apiKey: string;
  private privateKey: string;
  private timeout: number;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    this.apiKey = import.meta.env.VITE_API_KEY || '';
    this.privateKey = import.meta.env.VITE_PRIVATE_KEY || '';
    this.timeout = 30000; // 30 seconds
  }

  private createPromptTemplate(userPrompt: string, enhancementType: string): string {
    const templates = {
      detailed: `Transform this simple prompt into a comprehensive, detailed version with clear instructions, context, and specific requirements. Return only the enhanced prompt without any explanations.

Original: ${userPrompt}

Enhanced prompt:`,

      creative: `Transform this prompt into a creative, innovative version that encourages original thinking and unique approaches. Return only the enhanced prompt without any explanations.

Original: ${userPrompt}

Enhanced prompt:`,

      technical: `Transform this prompt into a technical, precise version with specific requirements, best practices, and implementation details. Return only the enhanced prompt without any explanations.

Original: ${userPrompt}

Enhanced prompt:`,

      concise: `Transform this prompt into a clear, direct, and concise version focused on immediate actionable results. Return only the enhanced prompt without any explanations.

Original: ${userPrompt}

Enhanced prompt:`,

      image: `Transform this into a detailed image generation prompt optimized for AI image tools like DALL-E, Midjourney, or Stable Diffusion. Include visual details, style, lighting, composition, and technical specifications. Return only the enhanced prompt in English without any explanations.

Original: ${userPrompt}

Enhanced image prompt:`,

      video: `Transform this into a detailed video generation prompt optimized for AI video tools like RunwayML or Pika Labs. Include movement, cinematography, duration, visual style, and technical specifications. Return only the enhanced prompt in English without any explanations.

Original: ${userPrompt}

Enhanced video prompt:`,

      'image-editing': `Transform this into a detailed AI image editing prompt optimized for AI photo editing tools like Photoshop AI, Canva AI, Remove.bg, or similar AI-powered editing services. Focus on specific AI editing commands, effects, and transformations. Return only the enhanced AI editing prompt without any explanations.

Original: ${userPrompt}

Enhanced AI image editing prompt:`,

      'video-editing': `Transform this into a detailed AI video editing prompt optimized for AI video editing tools like RunwayML, Kapwing AI, Descript, or similar AI-powered video editing services. Focus on specific AI editing commands, effects, transitions, and automated editing tasks. Return only the enhanced AI video editing prompt without any explanations.

Original: ${userPrompt}

Enhanced AI video editing prompt:`
    };

    return templates[enhancementType] || templates.detailed;
  }

  private async generateSignature(method: string, url: string): Promise<{ signature: string; timestamp: string }> {
    const timestamp = new Date().toISOString();
    const apiUrl = `/api${url}`;
    const payload = `${method}:${apiUrl}:${timestamp}`;
    const encoder = new TextEncoder();
    const privateKey = encoder.encode(import.meta.env.VITE_PRIVATE_KEY);

    const key = await window.crypto.subtle.importKey(
      'raw',
      privateKey,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await window.crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');

    return { signature, timestamp };
  }

  private async makeRequest(prompt: string, enhancementType: string): Promise<string> {
    const { signature, timestamp } = await this.generateSignature('POST', '/llm');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/llm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': this.apiKey,
          'x-signature': signature,
          'x-timestamp': timestamp,
        },
        body: JSON.stringify({
          prompt: this.createPromptTemplate(prompt, enhancementType),
          provider: 'openai',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.output) {
        throw new Error('Resposta da API não contém o campo "output"');
      }

      return data.output;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async enhancePrompt(userPrompt: string, enhancementType: string = 'detailed'): Promise<ApiResponse> {
    if (!userPrompt?.trim()) {
      return {
        success: false,
        error: 'Prompt não pode estar vazio',
        enhancedPrompt: '',
      };
    }

    try {
      const enhancedPrompt = await this.makeRequest(userPrompt.trim(), enhancementType);

      return {
        success: true,
        enhancedPrompt: enhancedPrompt.trim(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro desconhecido',
        enhancedPrompt: '',
      };
    }
  }
}

// Singleton instance
export const promptEnhancementService = new PromptEnhancementService();

// Função auxiliar para fallback local (caso a API falhe)
export const getLocalEnhancement = (prompt: string, type: string): string => {
  const enhancementTemplates = {
    detailed: {
      prefix: "Create a comprehensive and detailed response that addresses",
      structure: `
Context: [Define specific context and background]
Objective: [Specify clear goal]
Requirements:
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

Expected Output:
- Use structured format with clear sections
- Include practical examples and actionable insights
- Provide step-by-step guidance where applicable
- Address potential challenges and solutions

Quality Criteria:
- Technical accuracy and practical applicability
- Clear communication and logical flow`,
      modifiers: [
        "with comprehensive analysis and step-by-step guidance",
        "including specific examples and practical applications",
        "with detailed context and background information",
        "addressing potential challenges and alternative solutions"
      ]
    },
    creative: {
      prefix: "Generate an innovative and creative approach to",
      structure: `
Creative Challenge: [Reframe the problem inspirationally]
Multiple Perspectives: Explore at least 3 different approaches
Brainstorming Elements:
- Conventional ideas: [list]
- Innovative concepts: [list]
- Disruptive possibilities: [list]

Creative Development:
- Use analogies and metaphors
- Incorporate storytelling elements
- Think in unusual connections
- Explore "what if" scenarios

Expected Outcome:
- Original and viable solutions
- Engaging narrative approach
- Multiple creative alternatives`,
      modifiers: [
        "with unique perspectives and unconventional approaches",
        "incorporating storytelling and creative elements",
        "using vivid and inspiring language",
        "thinking outside the box while maintaining practical relevance"
      ]
    },
    technical: {
      prefix: "Provide a precise technical solution for",
      structure: `
Technical Specifications:
- Requirements: [detailed list]
- Constraints: [technical limitations]
- Standards: [applicable standards]

Implementation:
- Architecture: [technical description]
- Technologies: [recommended stack]
- Configuration: [specific parameters]

Code Examples:
\`\`\`
[Code or configuration examples]
\`\`\`

Considerations:
- Performance and scalability
- Security and compliance
- Maintainability and documentation`,
      modifiers: [
        "with detailed technical specifications and standards",
        "including authoritative sources and best practices",
        "providing implementation details and code examples",
        "addressing scalability and performance considerations"
      ]
    },
    concise: {
      prefix: "Provide a clear and direct solution for",
      structure: `
Objective: [One clear sentence]
Action Required: [What to do]
Essential Steps:
1. [Specific action 1]
2. [Specific action 2]
3. [Specific action 3]

Expected Result: [Specific outcome]
Next Steps: [Immediate actions]

Format: Bullet points, numbered lists, maximum 200 words`,
      modifiers: [
        "focusing on essential and actionable information",
        "using bullet points or numbered lists for clarity",
        "eliminating unnecessary details while maintaining completeness",
        "providing immediate actionable value"
      ]
    },
    image: {
      prefix: "Create a detailed image generation prompt describing",
      structure: `
Visual Description: [Central element of the image]
Style & Technique: [Artistic style, photography, digital art]
Composition: [Framing, perspective, rule of thirds]
Lighting: [Type, direction, intensity, time of day]
Colors & Palette: [Color scheme, saturation, temperature]
Texture & Details: [Surfaces, materials, finishes]
Atmosphere & Mood: [Emotion, feeling, energy]
Technical Quality: [Resolution, sharpness, depth of field]
Negative Prompts: [Elements to avoid]

Format: Optimized prompt for AI image generation`,
      modifiers: [
        "with specific visual descriptions and artistic details",
        "specifying artistic style and rendering technique",
        "defining lighting, colors, and composition precisely",
        "adding technical quality specifications",
        "including atmospheric and narrative visual elements"
      ]
    },
    video: {
      prefix: "Create a specialized video generation prompt describing",
      structure: `
Main Sequence: [Central action or movement]
Duration & Pacing: [Time, speed, rhythm]
Cinematography: [Angles, camera movements, transitions]
Temporal Narrative: [Beginning, development, conclusion]
Visual Elements: [Setting, characters, moving objects]
Dynamic Lighting: [Light changes over time]
Technical Quality: [FPS, resolution, stabilization]
Visual Style: [Color treatment, filters, effects]
Continuity: [Flow, temporal coherence]
Specifications: [Format, codec, technical aspects]

Format: Optimized prompt for AI video generation`,
      modifiers: [
        "describing movement and action specifically",
        "including cinematography and direction details",
        "specifying duration and sequence pacing",
        "defining technical quality and specifications",
        "adding temporal narrative elements"
      ]
    },
    'image-editing': {
      prefix: "Create an AI image editing prompt for",
      structure: `
AI Editing Task: [Specific editing operation]
Target Elements: [What to edit/modify/enhance]
Desired Outcome: [Expected result]
AI Commands:
- Remove: [elements to remove]
- Enhance: [features to improve]
- Add: [elements to insert]
- Transform: [changes to apply]

Style & Quality:
- Maintain: [aspects to preserve]
- Improve: [quality enhancements]
- Style: [artistic direction]

AI Tool Optimization:
- Use advanced AI algorithms for [specific task]
- Apply intelligent selection for [target areas]
- Ensure seamless blending and natural results`,
      modifiers: [
        "optimized for AI-powered photo editing tools",
        "using specific AI editing commands and terminology",
        "focusing on automated intelligent processing",
        "ensuring natural and seamless AI-generated results",
        "leveraging machine learning capabilities for enhancement"
      ]
    },
    'video-editing': {
      prefix: "Create an AI video editing prompt for",
      structure: `
AI Editing Objective: [Main editing goal]
Video Elements: [Clips, scenes, segments to process]
AI Operations:
- Auto-cut: [scene detection and cutting]
- Enhance: [quality improvements]
- Generate: [transitions, effects, titles]
- Sync: [audio-video alignment]

Automated Tasks:
- Smart cropping and framing
- Intelligent color correction
- Automatic subtitle generation
- Scene transition detection

AI Style & Effects:
- Apply: [specific AI effects]
- Generate: [automated elements]
- Optimize: [quality enhancements]

Output Specifications:
- Format: [video format and quality]
- Duration: [target length]
- Style: [visual treatment]`,
      modifiers: [
        "optimized for AI-powered video editing platforms",
        "using automated editing and enhancement commands",
        "leveraging machine learning for intelligent processing",
        "focusing on AI-generated transitions and effects",
        "ensuring professional automated post-production results"
      ]
    }
  };

  const template = enhancementTemplates[type] || enhancementTemplates.detailed;
  const selectedModifiers = template.modifiers
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  return `${template.prefix} ${prompt.toLowerCase()}.

${template.structure}

Key Instructions:
${selectedModifiers.map(modifier => `- ${modifier}`).join('\n')}

Original Request: "${prompt}"

Important: Adapt all instructions above to the specific context of the original request, maintaining the ${type} style and structure.`;
};
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
  private timeout: number;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    this.timeout = 30000; // 30 seconds
  }

  private async requestNewSessionToken(): Promise<void> {
    if (this.tokenRefreshPromise) {
      console.log('Token refresh already in progress.');
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = new Promise(async (resolve, reject) => {
      try {
        console.log('Requesting new session token from back-end...');
        const response = await fetch(`${this.baseUrl}/session/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to get session token: ${response.status} - ${response.statusText}. Body: ${errorText}`);
          throw new Error(`Failed to get session token: ${response.status} - ${response.statusText}`);
        }

        // Token is now set as an HttpOnly cookie by the backend, no need to store in sessionStorage
        console.log('Successfully obtained new session token (set as HttpOnly cookie).');
        resolve(); // Resolve without a value as token is in cookie
      } catch (error) {
        console.error('Error requesting session token:', error);
        reject(error);
      } finally {
        this.tokenRefreshPromise = null;
      }
    });
    return this.tokenRefreshPromise;
  }

  private createPromptTemplate(userPrompt: string, enhancementType: string): string {
    const templates = {
      detailed: `Transform this simple prompt into a comprehensive, detailed version with clear instructions, context, and specific requirements. Return only the enhanced prompt without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced prompt:`,

      creative: `Transform this prompt into a creative, innovative version that encourages original thinking and unique approaches. Return only the enhanced prompt without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced prompt:`,

      technical: `Transform this prompt into a technical, precise version with specific requirements, best practices, and implementation details. Return only the enhanced prompt without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced prompt:`,

      concise: `Transform this prompt into a clear, direct, and concise version focused on immediate actionable results. Return only the enhanced prompt without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced prompt:`,

      // Image Enhancement Types
      'image-realistic': `Transform this into a detailed photorealistic image generation prompt optimized for AI image tools like DALL-E, Midjourney, or Stable Diffusion. Focus on realistic photography, natural lighting, accurate proportions, and photographic techniques. Include camera settings, lighting conditions, and realistic details. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced realistic image prompt:`,

      'image-artistic': `Transform this into a detailed artistic image generation prompt optimized for AI image tools. Focus on artistic styles, creative techniques, color palettes, artistic movements, and unique visual aesthetics. Include artistic mediums, styles, and creative elements. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced artistic image prompt:`,

      'image-anime': `Transform this into a detailed anime/manga style image generation prompt optimized for AI image tools like NovelAI, Waifu Diffusion, or Anything V3. Focus on anime art style, manga aesthetics, Japanese animation characteristics, character design elements, and anime-specific visual features. Include anime art techniques, character expressions, and Japanese visual culture elements. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced anime/manga image prompt:`,

      'image-commercial': `Transform this into a detailed commercial image generation prompt optimized for AI image tools. Focus on product photography, marketing visuals, brand aesthetics, and commercial appeal. Include professional lighting, commercial composition, and market-ready visual elements. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced commercial image prompt:`,

      // Video Enhancement Types
      'video-cinematic': `Transform this into a detailed cinematic video generation prompt optimized for AI video tools like RunwayML or Pika Labs. Focus on cinematic techniques, camera movements, dramatic lighting, storytelling elements, and film-quality production. Include cinematography details, visual narrative, and cinematic aesthetics. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced cinematic video prompt:`,

      'video-documentary': `Transform this into a detailed documentary video generation prompt optimized for AI video tools. Focus on informational content, educational value, realistic presentation, and documentary-style filming. Include documentary techniques, informational elements, and educational visual approaches. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced documentary video prompt:`,

      'video-animated': `Transform this into a detailed animated video generation prompt optimized for AI video tools. Focus on animation techniques, motion graphics, animated characters, and dynamic visual effects. Include animation styles, motion elements, and animated storytelling. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced animated video prompt:`,

      'video-commercial': `Transform this into a detailed commercial video generation prompt optimized for AI video tools. Focus on promotional content, marketing messages, brand presentation, and commercial appeal. Include commercial techniques, marketing elements, and promotional visual strategies. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced commercial video prompt:`,

      'image-editing': `Transform this into a detailed AI image editing prompt optimized for AI photo editing tools like Photoshop AI, Canva AI, Remove.bg, or similar AI-powered editing services. Focus on specific AI editing commands, effects, and transformations. Return only the enhanced AI editing prompt without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced AI image editing prompt:`,

      'video-editing': `Transform this into a detailed AI video editing prompt optimized for AI video editing tools like RunwayML, Kapwing AI, Descript, or similar AI-powered video editing services. Focus on specific AI editing commands, effects, transitions, and automated editing tasks. Return only the enhanced AI video editing prompt without any explanations.\n\nOriginal: ${userPrompt}\n\nEnhanced AI video editing prompt:`
    };

    return templates[enhancementType] || templates.detailed;
  }

  private async makeLlmRequest(prompt: string, enhancementType: string, retryCount = 0): Promise<any> {
    const url = `${this.baseUrl}/llm`;
    const body = {
      prompt: this.createPromptTemplate(prompt, enhancementType),
      provider: 'openai',
    };
    const method = 'POST';

    return this.makeRequest(method, url, body, retryCount);
  }

  private async makeRequest(method: string, url: string, body?: any, retryCount = 0): Promise<any> {
    // No need to check this.sessionToken here, browser sends cookie automatically
    // If 401, it means cookie is missing or invalid/expired

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'x-session-token': this.sessionToken, // No longer needed, token is in cookie
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401 && retryCount === 0) {
          console.warn('Received 401, attempting to refresh token and retry...');
          // No need to clear sessionToken or sessionStorage, just request new token
          await this.requestNewSessionToken(); // Request a new token (will set new cookie)
          return this.makeRequest(method, url, body, 1); // Retry once
        }
        const errorBody = await response.text();
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}. Detalhes: ${errorBody}`);
      }

      return await response.json();
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
      const enhancedPromptResponse = await this.makeLlmRequest(userPrompt.trim(), enhancementType);

      if (!enhancedPromptResponse || typeof enhancedPromptResponse.output !== 'string') {
        throw new Error('Resposta inválida da API de aprimoramento de prompt.');
      }

      return {
        success: true,
        enhancedPrompt: enhancedPromptResponse.output.trim(),
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
    detailed: `Transform this simple prompt into a comprehensive, detailed version with clear instructions, context, and specific requirements. Return only the enhanced prompt without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced prompt:`,

    creative: `Transform this prompt into a creative, innovative version that encourages original thinking and unique approaches. Return only the enhanced prompt without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced prompt:`,

    technical: `Transform this prompt into a technical, precise version with specific requirements, best practices, and implementation details. Return only the enhanced prompt without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced prompt:`,

    concise: `Transform this prompt into a clear, direct, and concise version focused on immediate actionable results. Return only the enhanced prompt without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced prompt:`,

    // Image Enhancement Types
    'image-realistic': `Transform this into a detailed photorealistic image generation prompt optimized for AI image tools like DALL-E, Midjourney, or Stable Diffusion. Focus on realistic photography, natural lighting, accurate proportions, and photographic techniques. Include camera settings, lighting conditions, and realistic details. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced realistic image prompt:`,

    'image-artistic': `Transform this into a detailed artistic image generation prompt optimized for AI image tools. Focus on artistic styles, creative techniques, color palettes, artistic movements, and unique visual aesthetics. Include artistic mediums, styles, and creative elements. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced artistic image prompt:`,

    'image-anime': `Transform this into a detailed anime/manga style image generation prompt optimized for AI image tools like NovelAI, Waifu Diffusion, or Anything V3. Focus on anime art style, manga aesthetics, Japanese animation characteristics, character design elements, and anime-specific visual features. Include anime art techniques, character expressions, and Japanese visual culture elements. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced anime/manga image prompt:`,

    'image-commercial': `Transform this into a detailed commercial image generation prompt optimized for AI image tools. Focus on product photography, marketing visuals, brand aesthetics, and commercial appeal. Include professional lighting, commercial composition, and market-ready visual elements. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced commercial image prompt:`,

    // Video Enhancement Types
    'video-cinematic': `Transform this into a detailed cinematic video generation prompt optimized for AI video tools like RunwayML or Pika Labs. Focus on cinematic techniques, camera movements, dramatic lighting, storytelling elements, and film-quality production. Include cinematography details, visual narrative, and cinematic aesthetics. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced cinematic video prompt:`,

    'video-documentary': `Transform this into a detailed documentary video generation prompt optimized for AI video tools. Focus on informational content, educational value, realistic presentation, and documentary-style filming. Include documentary techniques, informational elements, and educational visual approaches. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced documentary video prompt:`,

    'video-animated': `Transform this into a detailed animated video generation prompt optimized for AI video tools. Focus on animation techniques, motion graphics, animated characters, and dynamic visual effects. Include animation styles, motion elements, and animated storytelling. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced animated video prompt:`,

    'video-commercial': `Transform this into a detailed commercial video generation prompt optimized for AI video tools. Focus on promotional content, marketing messages, brand presentation, and commercial appeal. Include commercial techniques, marketing elements, and promotional visual strategies. Return only the enhanced prompt in English without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced commercial video prompt:`,

    'image-editing': `Transform this into a detailed AI image editing prompt optimized for AI photo editing tools like Photoshop AI, Canva AI, Remove.bg, or similar AI-powered editing services. Focus on specific AI editing commands, effects, and transformations. Return only the enhanced AI editing prompt without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced AI image editing prompt:`,

    'video-editing': `Transform this into a detailed AI video editing prompt optimized for AI video editing tools like RunwayML, Kapwing AI, Descript, or similar AI-powered video editing services. Focus on specific AI editing commands, effects, transitions, and automated editing tasks. Return only the enhanced AI video editing prompt without any explanations.\n\nOriginal: ${prompt}\n\nEnhanced AI video editing prompt:`
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
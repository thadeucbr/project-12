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
  private sessionToken: string | null = null;
  private tokenRefreshPromise: Promise<string> | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    this.timeout = 30000; // 30 seconds
    this.initializeSessionToken();
  }

  private async initializeSessionToken() {
    // Try to get token from sessionStorage first
    const storedToken = sessionStorage.getItem('sessionToken');
    console.log('Initializing session token. Stored token:', storedToken);
    if (storedToken) {
      this.sessionToken = storedToken;
    }

    // Request a new token if not available or if it's about to expire (simple check)
    if (!this.sessionToken) {
      console.log("No session token found or it's null, requesting new one...");
      await this.requestNewSessionToken();
    }
  }

  private async requestNewSessionToken(): Promise<string> {
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
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to get session token: ${response.status} - ${response.statusText}. Body: ${errorText}`);
          throw new Error(`Failed to get session token: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        this.sessionToken = data.token;
        sessionStorage.setItem('sessionToken', data.token);
        console.log('Successfully obtained and stored new session token:', data.token);
        resolve(data.token);
      } catch (error) {
        console.error('Error requesting session token:', error);
        this.sessionToken = null; // Clear token on error
        sessionStorage.removeItem('sessionToken');
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

  private async makeRequest(prompt: string, enhancementType: string, retryCount = 0): Promise<string> {
    if (!this.sessionToken) {
      console.log('Session token missing for makeRequest, attempting to request new one.');
      await this.requestNewSessionToken();
      if (!this.sessionToken) {
        throw new Error('No session token available after request. Please refresh the page.');
      }
    }
    console.log('Making request with session token:', this.sessionToken);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/llm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-session-token': this.sessionToken, // Use the session token
        },
        body: JSON.stringify({
          prompt: this.createPromptTemplate(prompt, enhancementType),
          provider: 'openai',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401 && retryCount === 0) {
          console.warn('Received 401, attempting to refresh token and retry...');
          this.sessionToken = null; // Invalidate current token
          sessionStorage.removeItem('sessionToken');
          await this.requestNewSessionToken(); // Request a new token
          return this.makeRequest(prompt, enhancementType, 1); // Retry once
        }
        const errorBody = await response.text();
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}. Detalhes: ${errorBody}`);
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
    'image-realistic': {
      prefix: "Create a photorealistic image prompt describing",
      structure: `
Subject: [Main subject with realistic details]
Photography Style: [Portrait, landscape, macro, street photography]
Camera Settings: [Aperture, focal length, ISO]
Lighting: [Natural light, golden hour, studio lighting]
Composition: [Rule of thirds, leading lines, depth of field]
Environment: [Realistic setting and background]
Details: [Textures, materials, realistic proportions]
Quality: [High resolution, sharp focus, professional quality]

Technical Specifications:
- Camera: [Specific camera model if relevant]
- Lens: [Lens type and focal length]
- Post-processing: [Minimal, natural color grading]`,
      modifiers: [
        "with photographic precision and realistic lighting",
        "including camera technical specifications",
        "focusing on natural textures and authentic details",
        "emphasizing photorealistic quality and professional composition"
      ]
    },
    'image-artistic': {
      prefix: "Create an artistic image prompt describing",
      structure: `
Artistic Style: [Impressionism, surrealism, abstract, digital art]
Medium: [Oil painting, watercolor, digital illustration, mixed media]
Color Palette: [Specific colors, temperature, saturation]
Composition: [Artistic arrangement, visual flow]
Technique: [Brushstrokes, texture, artistic methods]
Mood: [Emotional tone, atmosphere]
Inspiration: [Art movement, famous artist style]
Visual Elements: [Shapes, patterns, artistic details]

Artistic Quality:
- Creative interpretation over realism
- Expressive use of color and form
- Unique artistic perspective
- Emotional or conceptual depth`,
      modifiers: [
        "with distinctive artistic style and creative interpretation",
        "incorporating expressive colors and artistic techniques",
        "emphasizing creative composition and visual impact",
        "drawing inspiration from art movements and masters"
      ]
    },
    'image-anime': {
      prefix: "Create an anime/manga style image prompt describing",
      structure: `
Anime Style: [Specific anime art style - shounen, shoujo, seinen, etc.]
Character Design: [Anime character features and proportions]
Art Technique: [Cell shading, soft shading, line art style]
Color Palette: [Vibrant anime colors, pastel tones, dramatic contrasts]
Expression: [Anime facial expressions and emotions]
Background: [Anime-style environments and settings]
Visual Effects: [Anime-specific effects like speed lines, sparkles]
Cultural Elements: [Japanese aesthetic elements]

Anime Quality Standards:
- Authentic anime/manga art style
- Characteristic anime proportions and features
- Japanese animation aesthetics
- Expressive character design`,
      modifiers: [
        "with authentic anime art style and character design",
        "incorporating Japanese animation aesthetics and techniques",
        "emphasizing anime-specific visual elements and expressions",
        "maintaining traditional manga and anime artistic conventions"
      ]
    },
    'image-commercial': {
      prefix: "Create a commercial image prompt describing",
      structure: `
Product/Service: [What is being promoted]
Target Audience: [Demographics and preferences]
Brand Message: [Key selling points]
Commercial Style: [Clean, modern, luxury, lifestyle]
Marketing Goal: [Awareness, sales, brand building]
Professional Quality: [High-end commercial standards]
Market Appeal: [Broad or niche market focus]
Call to Action: [Visual elements that drive engagement]

Commercial Requirements:
- Professional photography standards
- Market-ready visual appeal
- Brand-consistent presentation
- Sales-oriented composition`,
      modifiers: [
        "with professional commercial quality and market appeal",
        "incorporating brand messaging and target audience focus",
        "emphasizing sales-oriented visual elements",
        "maintaining high commercial photography standards"
      ]
    },
    'video-cinematic': {
      prefix: "Create a cinematic video prompt describing",
      structure: `
Scene: [Cinematic sequence description]
Camera Work: [Shots, angles, movements]
Cinematography: [Visual style, color grading]
Lighting: [Dramatic, natural, studio lighting]
Narrative: [Story elements, character development]
Pacing: [Rhythm, timing, flow]
Visual Effects: [Practical or digital effects]
Audio: [Sound design, music, dialogue]

Cinematic Quality:
- Film-quality production values
- Professional cinematography
- Dramatic visual storytelling
- Emotional engagement through visuals`,
      modifiers: [
        "with professional cinematography and film-quality production",
        "incorporating dramatic lighting and camera techniques",
        "emphasizing visual storytelling and narrative flow",
        "maintaining cinematic standards and emotional impact"
      ]
    },
    'video-documentary': {
      prefix: "Create a documentary video prompt describing",
      structure: `
Subject: [Documentary topic or focus]
Documentary Style: [Observational, expository, participatory]
Information: [Key facts, data, insights]
Interview Elements: [Expert opinions, testimonials]
B-roll: [Supporting footage, visuals]
Educational Value: [Learning objectives]
Authenticity: [Real-world, factual content]
Narrative Structure: [Beginning, middle, end]

Documentary Standards:
- Factual accuracy and credibility
- Educational and informative content
- Authentic real-world representation
- Clear information delivery`,
      modifiers: [
        "with documentary authenticity and educational value",
        "incorporating factual information and expert insights",
        "emphasizing real-world representation and credibility",
        "maintaining journalistic standards and objectivity"
      ]
    },
    'video-animated': {
      prefix: "Create an animated video prompt describing",
      structure: `
Animation Style: [2D, 3D, motion graphics, stop-motion]
Characters: [Animated characters or elements]
Movement: [Animation techniques, transitions]
Visual Effects: [Particle effects, transformations]
Color Scheme: [Vibrant, stylized color palette]
Timing: [Animation pacing, keyframes]
Style: [Cartoon, realistic, abstract animation]
Storytelling: [Animated narrative elements]

Animation Quality:
- Smooth and fluid motion
- Creative visual effects
- Stylized artistic approach
- Engaging animated storytelling`,
      modifiers: [
        "with smooth animation and creative visual effects",
        "incorporating stylized artistic elements and motion",
        "emphasizing animated storytelling and character development",
        "maintaining high animation quality and visual appeal"
      ]
    },
    'video-commercial': {
      prefix: "Create a commercial video prompt describing",
      structure: `
Product/Service: [What is being advertised]
Brand Message: [Key marketing points]
Target Audience: [Demographics and interests]
Commercial Format: [TV ad, social media, web commercial]
Call to Action: [What viewers should do]
Brand Identity: [Visual style, tone, personality]
Marketing Strategy: [Awareness, conversion, retention]
Production Value: [Professional commercial quality]

Commercial Requirements:
- Clear brand messaging
- Audience-targeted content
- Professional production standards
- Effective call to action`,
      modifiers: [
        "with professional commercial production and clear messaging",
        "incorporating brand identity and target audience appeal",
        "emphasizing marketing effectiveness and call to action",
        "maintaining broadcast-quality commercial standards"
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
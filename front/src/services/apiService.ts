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

      // Image Enhancement Types
      'image-realistic': `Transform this into a detailed photorealistic image generation prompt optimized for AI image tools like DALL-E, Midjourney, or Stable Diffusion. Focus on realistic photography, natural lighting, accurate proportions, and photographic techniques. Include camera settings, lighting conditions, and realistic details. Return only the enhanced prompt in English without any explanations.

Original: ${userPrompt}

Enhanced realistic image prompt:`,

      'image-artistic': `Transform this into a detailed artistic image generation prompt optimized for AI image tools. Focus on artistic styles, creative techniques, color palettes, artistic movements, and unique visual aesthetics. Include artistic mediums, styles, and creative elements. Return only the enhanced prompt in English without any explanations.

Original: ${userPrompt}

Enhanced artistic image prompt:`,

      'image-conceptual': `Transform this into a detailed conceptual image generation prompt optimized for AI image tools. Focus on abstract concepts, symbolic elements, experimental compositions, and thought-provoking visuals. Include conceptual themes, symbolic meanings, and innovative visual approaches. Return only the enhanced prompt in English without any explanations.

Original: ${userPrompt}

Enhanced conceptual image prompt:`,

      'image-commercial': `Transform this into a detailed commercial image generation prompt optimized for AI image tools. Focus on product photography, marketing visuals, brand aesthetics, and commercial appeal. Include professional lighting, commercial composition, and market-ready visual elements. Return only the enhanced prompt in English without any explanations.

Original: ${userPrompt}

Enhanced commercial image prompt:`,

      // Video Enhancement Types
      'video-cinematic': `Transform this into a detailed cinematic video generation prompt optimized for AI video tools like RunwayML or Pika Labs. Focus on cinematic techniques, camera movements, dramatic lighting, storytelling elements, and film-quality production. Include cinematography details, visual narrative, and cinematic aesthetics. Return only the enhanced prompt in English without any explanations.

Original: ${userPrompt}

Enhanced cinematic video prompt:`,

      'video-documentary': `Transform this into a detailed documentary video generation prompt optimized for AI video tools. Focus on informational content, educational value, realistic presentation, and documentary-style filming. Include documentary techniques, informational elements, and educational visual approaches. Return only the enhanced prompt in English without any explanations.

Original: ${userPrompt}

Enhanced documentary video prompt:`,

      'video-animated': `Transform this into a detailed animated video generation prompt optimized for AI video tools. Focus on animation techniques, motion graphics, animated characters, and dynamic visual effects. Include animation styles, motion elements, and animated storytelling. Return only the enhanced prompt in English without any explanations.

Original: ${userPrompt}

Enhanced animated video prompt:`,

      'video-commercial': `Transform this into a detailed commercial video generation prompt optimized for AI video tools. Focus on promotional content, marketing messages, brand presentation, and commercial appeal. Include commercial techniques, marketing elements, and promotional visual strategies. Return only the enhanced prompt in English without any explanations.

Original: ${userPrompt}

Enhanced commercial video prompt:`,

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
    'image-conceptual': {
      prefix: "Create a conceptual image prompt describing",
      structure: `
Concept: [Abstract idea or theme]
Symbolism: [Symbolic elements and meanings]
Visual Metaphor: [How concept is represented visually]
Abstract Elements: [Non-literal visual components]
Experimental Approach: [Unconventional techniques]
Thought-provoking Elements: [Elements that challenge perception]
Conceptual Depth: [Layers of meaning]
Innovation: [Unique visual approach]

Conceptual Framework:
- Ideas over literal representation
- Symbolic and metaphorical content
- Experimental visual language
- Intellectual or philosophical depth`,
      modifiers: [
        "with abstract concepts and symbolic representation",
        "incorporating experimental visual techniques",
        "emphasizing intellectual depth and meaning",
        "challenging conventional visual representation"
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
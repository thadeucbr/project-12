

interface ApiResponse {
  enhancedPrompt: string;
  success: boolean;
  error?: string;
}

class PromptEnhancementService {
  private baseUrl: string;
  private timeout: number;
  private tokenRefreshPromise: Promise<void> | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    this.timeout = 30000; // 30 seconds
  }

  private async requestNewSessionToken(): Promise<void> {
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/session/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to get session token: ${response.status} - ${response.statusText}`);
        }
      } finally {
        this.tokenRefreshPromise = null;
      }
    })();

    return this.tokenRefreshPromise;
  }

  private createPromptTemplate(userPrompt: string, enhancementType: string): string {
    const baseStructure = {
      persona: "Act as a world-class expert prompt engineer. Your goal is to transform a simple user prompt into a detailed, structured, and highly effective prompt for a large language model (LLM) or generative AI. You must follow all instructions precisely.",
      context: "You are designing a prompt for a generative AI to perform a specific task. The user has provided a basic idea. Your job is to expand it into a comprehensive prompt that is clear, specific, and follows best practices for prompt engineering.",
      task: "Based on the user's original prompt, create a new, enhanced prompt that is ready to be used with a generative AI. The enhanced prompt must be detailed, well-structured, and tailored to the selected enhancement type.",
      instructions: {
        detailed: "The enhanced prompt must be extremely detailed, providing extensive context, step-by-step instructions, specific constraints, and clear examples of the desired output format. It should leave no room for ambiguity.",
        creative: "The enhanced prompt should inspire a highly creative and original response from the AI. Use vivid and imaginative language, encourage unconventional thinking, and ask for outputs that are unexpected and innovative.",
        technical: "The enhanced prompt must be technically precise. It should include specific formats, algorithms, code snippets (if applicable), and technical constraints. The language should be unambiguous and suitable for a technical audience.",
        concise: "The enhanced prompt must be direct and to the point. It should ask for a specific, actionable output without any unnecessary verbiage. Clarity and brevity are key.",
        'image-realistic': "The enhanced prompt should be a rich, detailed description for an AI image generator to create a photorealistic image. Include details about the subject, setting, lighting (e.g., golden hour, studio lighting), camera lens and settings (e.g., 85mm, f/1.8, shallow depth of field), and overall mood. The goal is realism.",
        'image-artistic': "The enhanced prompt should describe an artistic image. Specify the art style (e.g., surrealism, cubism, vaporwave), the medium (e.g., oil painting, watercolor, digital art), the color palette, and the overall composition. The goal is a visually striking and artistic image.",
        'image-anime': "The enhanced prompt should describe an anime-style image. Specify the anime style (e.g., Shonen, Shojo, Chibi), character design details (hair, eyes, clothing), the setting, and the overall mood. The goal is an authentic anime aesthetic.",
        'image-commercial': "The enhanced prompt should describe a commercial product image. Specify the product, the setting (e.g., on a wooden table, in a minimalist studio), the lighting (e.g., soft and clean), and the overall branding aesthetic. The goal is a professional, eye-catching image for marketing.",
        'video-cinematic': "The prompt should describe a cinematic video shot. Specify the scene, camera angle (e.g., low-angle shot), camera movement (e.g., slow dolly zoom), lighting (e.g., dramatic, high-contrast), and the overall mood. Think of a scene from a movie.",
        'video-documentary': "The prompt should describe a documentary-style video shot. Specify the subject, the setting, the type of shot (e.g., talking head, archival footage), and the narrative tone. The goal is to inform and educate.",
        'video-animated': "The prompt should describe an animated video scene. Specify the animation style (e.g., 2D, 3D, stop-motion), the character actions, the background, and the overall story. The goal is a dynamic and engaging animation.",
        'video-commercial': "The prompt should describe a commercial video. Specify the product or service, the target audience, the key message, the visual style (e.g., fast-paced and energetic), and a call to action. The goal is to create a compelling advertisement.",
        'image-editing': "The prompt should provide a clear, step-by-step instruction for an AI image editing tool. Specify the desired action (e.g., 'remove the background', 'change the color of the shirt to blue', 'apply a vintage filter').",
        'video-editing': "The prompt should provide a clear instruction for an AI video editing tool. Specify the action (e.g., 'trim the first 5 seconds', 'add a title card with the text \"My Vacation\"', 'apply a cross-dissolve transition between all clips').",
      },
      structure: {
        prefix: "**Prompt:**\n\n",
        postfix: "\n\n**End of Prompt.**",
      },
      output_format: "Your final output must be only the enhanced prompt, enclosed in the specified prefix and postfix. Do not include any other text, explanations, or apologies. The prompt should be written in English unless the user's original prompt is in another language."
    };

    const selectedType = enhancementType in baseStructure.instructions ? enhancementType : 'detailed';
    const instruction = baseStructure.instructions[selectedType];

    const finalPrompt = `
# INSTRUCTIONS:
## Persona:
${baseStructure.persona}

## Context:
${baseStructure.context}
The user has provided the following basic prompt: "${userPrompt}"

## Task:
Your task is to refine and expand this basic prompt into a high-quality, detailed, and effective prompt for a generative AI. The final prompt must adhere to the following instructions:

1.  **Analyze the User's Intent:** Carefully consider the user's original prompt to understand their core goal.
2.  **Apply Enhancement Type:** The final prompt must be in the style of a "${selectedType}" prompt. This means: ${instruction}
3.  **Structure and Formatting:** The final prompt must be well-structured, easy to read, and use markdown for formatting (e.g., headings, lists, bolding) to improve clarity.
4.  **Use Clear Language:** Use clear, specific, and unambiguous language. Avoid jargon unless it's relevant to the topic.
5.  **Provide Examples (if applicable):** For more complex requests, you can include a small example of the desired output format within the prompt.
6.  **Enclose the Final Prompt:** The final, enhanced prompt you generate must start with exactly "**Prompt:**" and end with exactly "**End of Prompt.**". Do not add any other text or formatting outside of these markers.

## User's Original Prompt:
"${userPrompt}"

## Your Enhanced Prompt (MUST start with **Prompt:** and end with **End of Prompt.**):
`;
    return finalPrompt;
  }

  private async makeLlmRequest(prompt: string, enhancementType: string, retryCount = 0): Promise<unknown> {
    const url = `${this.baseUrl}/llm`;
    const body = {
      prompt: this.createPromptTemplate(prompt, enhancementType),
      provider: 'openai', // or other providers
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401 && retryCount === 0) {
          await this.requestNewSessionToken();
          return this.makeLlmRequest(prompt, enhancementType, 1);
        }
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} - ${response.statusText}. Details: ${errorBody}`);
      }

      return await response.json();
    } catch (_error) {
      clearTimeout(timeoutId);
      throw _error;
    }
  }

  async enhancePrompt(userPrompt: string, enhancementType: string = 'detailed'): Promise<ApiResponse> {
    if (!userPrompt?.trim()) {
      return {
        success: false,
        error: 'Prompt cannot be empty',
        enhancedPrompt: '',
      };
    }

    try {
      const llmResponse = await this.makeLlmRequest(userPrompt.trim(), enhancementType);

      if (!llmResponse || typeof llmResponse.output !== 'string') {
        throw new Error('Invalid response from the enhancement API.');
      }

      // Extract the content between **Prompt:** and **End of Prompt.**
      const enhancedPrompt = llmResponse.output;
      const promptStart = enhancedPrompt.indexOf('**Prompt:**');
      const promptEnd = enhancedPrompt.lastIndexOf('**End of Prompt.**');

      if (promptStart !== -1 && promptEnd > promptStart) {
        const finalPrompt = enhancedPrompt.substring(promptStart + '**Prompt:**'.length, promptEnd).trim();
        return {
          success: true,
          enhancedPrompt: finalPrompt,
        };
      }

      // Fallback if the markers are not found
      return {
        success: true,
        enhancedPrompt: enhancedPrompt.trim(),
      };

    } catch (_error) {
      // Fallback to a simpler local enhancement in case of API failure
      return {
        success: false,
        error: `Failed to enhance prompt: ${(_error as Error).message}. Please try again later.`,
        enhancedPrompt: '',
      };
    }
  }
}

// Singleton instance
export const promptEnhancementService = new PromptEnhancementService();

// Keep getLocalEnhancement for fallback or testing, but it's not used in the main flow anymore
export const getLocalEnhancement = (prompt: string, type: string): string => {
  const enhancementTemplates = {
    detailed: `[PROMPT ENHANCEMENT]
    **Act as a world-class expert prompt engineer.**
    Your task is to transform the following user prompt into a detailed and comprehensive prompt for a generative AI.
    Original prompt: "${prompt}"
    **Instructions:**
    1.  **Analyze the original prompt:** Identify the user's core intent.
    2.  **Expand and detail:** Add specific details, context, and constraints to the prompt.
    3.  **Structure the prompt:** Organize the prompt with clear headings and lists.
    4.  **Add examples:** If possible, provide a brief example of the desired output.
    5.  **Return only the new prompt.**`,
    creative: `[PROMPT ENHANCEMENT]
    **Act as a world-class expert prompt engineer with a flair for the imaginative.**
    Your task is to transform the following user prompt into a highly creative and inspiring prompt for a generative AI.
    Original prompt: "${prompt}"
    **Instructions:**
    1.  **Analyze the original prompt:** Identify the user's core intent.
    2.  **Inject creativity:** Use vivid language, metaphors, and open-ended questions to spark imagination.
    3.  **Encourage originality:** Ask the AI to generate something unexpected and unique.
    4.  **Return only the new prompt.**`,
    technical: `[PROMPT ENHANCEMENT]
    **Act as a world-class expert prompt engineer with deep technical knowledge.**
    Your task is to transform the following user prompt into a technically precise and detailed prompt for a generative AI.
    Original prompt: "${prompt}"
    **Instructions:**
    1.  **Analyze the original prompt:** Identify the user's core technical goal.
    2.  **Specify technical requirements:** Include formats, algorithms, constraints, and other technical specifications.
    3.  **Use precise language:** Ensure all instructions are clear, unambiguous, and technically accurate.
    4.  **Return only the new prompt.**`,
    concise: `[PROMPT ENHANCEMENT]
    **Act as a world-class expert prompt engineer who values brevity and clarity.**
    Your task is to transform the following user prompt into a concise and direct prompt for a generative AI.
    Original prompt: "${prompt}"
    **Instructions:**
    1.  **Analyze the original prompt:** Identify the user's key request.
    2.  **Eliminate verbosity:** Remove all unnecessary words and phrases.
    3.  **Focus on the core action:** Create a prompt that is direct and to the point.
    4.  **Return only the new prompt.**`,
  };

  const template = enhancementTemplates[type] || enhancementTemplates.detailed;
  return template;
};

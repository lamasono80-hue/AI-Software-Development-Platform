import { IAIProvider } from './interface';
import { GeminiAdapter } from './gemini';

export class AIProviderFactory {
  private static providers: Map<string, IAIProvider> = new Map();

  public static registerProvider(name: string, provider: IAIProvider) {
    this.providers.set(name.toLowerCase(), provider);
  }

  public static getProvider(providerName?: string, userApiKey?: string): IAIProvider {
    const activeName = (providerName || process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER || 'gemini').toLowerCase();
    
    // Default to Gemini Adapter if not found or requested
    if (activeName === 'gemini' || !this.providers.has(activeName)) {
      return new GeminiAdapter(userApiKey);
    }

    return this.providers.get(activeName)!;
  }
}

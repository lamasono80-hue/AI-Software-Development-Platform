export interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface IAIProvider {
  name: string;
  generateText(prompt: string, options?: AIOptions): Promise<string>;
  streamChat(messages: ChatMessage[], options?: AIOptions): AsyncGenerator<string, void, unknown>;
  generateJSON<T>(prompt: string, schema?: object, options?: AIOptions): Promise<T>;
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIProvider, AIOptions, ChatMessage } from './interface';

export class GeminiAdapter implements IAIProvider {
  name = 'Gemini';
  private genAI: GoogleGenerativeAI;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(key);
  }

  async generateText(prompt: string, options?: AIOptions): Promise<string> {
    const modelName = options?.model || 'gemini-1.5-flash';
    const model = this.genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: options?.systemInstruction,
    });

    const result = await model.generateContent(prompt);
    return result.response.text() || '';
  }

  async *streamChat(messages: ChatMessage[], options?: AIOptions): AsyncGenerator<string, void, unknown> {
    const modelName = options?.model || 'gemini-1.5-flash';
    const model = this.genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: options?.systemInstruction,
    });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1]?.content || '';
    const chat = model.startChat({ history });
    const resultStream = await chat.sendMessageStream(lastMessage);

    for await (const chunk of resultStream.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  }

  async generateJSON<T>(prompt: string, schema?: object, options?: AIOptions): Promise<T> {
    const modelName = options?.model || 'gemini-1.5-flash';
    const model = this.genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: options?.systemInstruction,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text() || '{}';
    return JSON.parse(text) as T;
  }
}

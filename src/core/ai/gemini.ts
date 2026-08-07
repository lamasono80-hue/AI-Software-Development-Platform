import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIProvider, AIOptions, ChatMessage } from './interface';

export class GeminiAdapter implements IAIProvider {
  name = 'Gemini';
  private genAI: GoogleGenerativeAI;
  private candidateModels = ['gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-pro-latest', 'gemini-pro'];

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(key);
  }

  async generateText(prompt: string, options?: AIOptions): Promise<string> {
    const modelsToTry = options?.model ? [options.model, ...this.candidateModels] : this.candidateModels;

    for (const modelName of modelsToTry) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: options?.systemInstruction,
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text) return text;
      } catch (err: any) {
        console.warn(`Model ${modelName} failed, trying next candidate...`, err?.message);
      }
    }

    throw new Error('Tất cả các model Gemini API (gemini-1.5-flash-latest, gemini-2.0-flash...) đều không khả dụng. Vui lòng kiểm tra lại GEMINI_API_KEY!');
  }

  async *streamChat(messages: ChatMessage[], options?: AIOptions): AsyncGenerator<string, void, unknown> {
    const firstUserIndex = messages.findIndex(m => m.role === 'user');
    const validMessages = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : messages;

    if (validMessages.length === 0) {
      return;
    }

    const history = validMessages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = validMessages[validMessages.length - 1]?.content || '';
    const modelsToTry = options?.model ? [options.model, ...this.candidateModels] : this.candidateModels;

    let streamSuccess = false;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: options?.systemInstruction,
        });

        const chat = model.startChat({ history });
        const resultStream = await chat.sendMessageStream(lastMessage);

        for await (const chunk of resultStream.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            yield chunkText;
          }
        }

        streamSuccess = true;
        break; // Successfully streamed from model
      } catch (err: any) {
        console.warn(`Stream model ${modelName} failed, trying next candidate...`, err?.message);
        lastError = err;
      }
    }

    if (!streamSuccess) {
      throw lastError || new Error('Không thể kết nối với Gemini API Stream!');
    }
  }

  async generateJSON<T>(prompt: string, schema?: object, options?: AIOptions): Promise<T> {
    const modelsToTry = options?.model ? [options.model, ...this.candidateModels] : this.candidateModels;

    for (const modelName of modelsToTry) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: options?.systemInstruction,
          generationConfig: {
            responseMimeType: 'application/json',
          },
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text) {
          return JSON.parse(text) as T;
        }
      } catch (err: any) {
        console.warn(`JSON model ${modelName} failed, trying next candidate...`, err?.message);
      }
    }

    throw new Error('Không thể khởi tạo JSON từ Gemini API!');
  }
}

import { NextResponse } from 'next/server';
import { AIProviderFactory } from '@/core/ai/factory';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, apiKey } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: 'Danh sách tin nhắn không hợp lệ!' }, { status: 400 });
    }

    const aiProvider = AIProviderFactory.getProvider('gemini', apiKey);

    const systemInstruction = `Bạn là DevPilot AI Assistant - Trợ lý trí tuệ nhân tạo chuyên biệt về Software Engineering, Kiến trúc Phần mềm và Lập trình.
Bạn là một chuyên gia lập trình thân thiện, thông minh, sâu sắc và chuyên nghiệp.
- Khi người dùng chào ("hi", "chào bạn", "bạn tên gì", "hello"), hãy tự giới thiệu bản thân là DevPilot AI Assistant và sẵn sàng hỗ trợ tự động hóa phát triển phần mềm.
- Khi người dùng hỏi bất kỳ câu hỏi nào (về code, thuật toán, SQL, ERD, SRS, hay bất kỳ chủ đề gì), hãy trả lời CHÍNH XÁC VÀ TRỰC TIẾP theo câu hỏi đó.
- Sử dụng định dạng Markdown đẹp mắt, có bọc code block với ngôn ngữ tương ứng (như \`\`\`sql, \`\`\`typescript, \`\`\`python...) khi viết mã nguồn.`;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          const generator = aiProvider.streamChat(messages, { systemInstruction });
          for await (const chunk of generator) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (err: any) {
          console.error('Gemini Stream Error:', err);
          const errorMsg = `\n[Lỗi kết nối Gemini AI: ${err?.message || 'Không thể tạo phản hồi streaming'}]`;
          controller.enqueue(encoder.encode(errorMsg));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Lỗi server khi gọi API AI Chat!',
    }, { status: 500 });
  }
}

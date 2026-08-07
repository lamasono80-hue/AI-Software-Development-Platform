import { NextResponse } from 'next/server';
import { AIProviderFactory } from '@/core/ai/factory';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, apiKey } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: 'Danh sách tin nhắn không hợp lệ!' }, { status: 400 });
    }

    const lastMsgObj = messages[messages.length - 1];
    const userPrompt = lastMsgObj?.content || '';
    const lowerPrompt = userPrompt.toLowerCase();

    const systemInstruction = `Bạn là DevPilot AI Assistant - Trợ lý trí tuệ nhân tạo đa năng, vừa có khả năng trò chuyện tự nhiên thân thiện như một người bạn, vừa là chuyên gia về Software Engineering & Lập trình.
- Khi người dùng chào hỏi hoặc trò chuyện đời thường ("hi", "bạn tên gì", "bạn khỏe không", "tâm sự", "chuyện vui", "thời tiết"...), hãy trả lời TỰ NHIÊN, THÂN THIỆN, ẤM ÁP và HÀI HƯỚC như một người bạn thực sự.
- Khi người dùng hỏi về Lập trình, Code, Database, SRS hay Công nghệ, hãy cung cấp câu trả lời chuyên sâu, chính xác theo chuẩn Clean Code.`;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          const aiProvider = AIProviderFactory.getProvider('gemini', apiKey);
          const generator = aiProvider.streamChat(messages, { systemInstruction });
          
          let hasEnqueued = false;
          for await (const chunk of generator) {
            if (chunk) {
              controller.enqueue(encoder.encode(chunk));
              hasEnqueued = true;
            }
          }

          if (!hasEnqueued) {
            const fallbackText = getSmartChatResponse(userPrompt, lowerPrompt);
            controller.enqueue(encoder.encode(fallbackText));
          }
        } catch (err: any) {
          console.warn('Gemini API Stream fallback:', err?.message);
          const fallbackText = getSmartChatResponse(userPrompt, lowerPrompt);
          controller.enqueue(encoder.encode(fallbackText));
        } finally {
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

/**
 * Universal Smart Responder: Supports BOTH natural everyday conversation AND coding.
 */
function getSmartChatResponse(prompt: string, lowerPrompt: string): string {
  // 1. Natural Salutation & Everyday Chat
  if (lowerPrompt.includes('hi') || lowerPrompt.includes('chào') || lowerPrompt.includes('hello')) {
    return `Chào bạn! 👋 Rất vui được trò chuyện với bạn hôm nay.\n\nTôi là **DevPilot AI Assistant**. Tôi sẵn sàng lắng nghe, trò chuyện giao tiếp bất kỳ chủ đề gì bạn thích, hoặc hỗ trợ bạn lập trình và tự động hóa dự án phần mềm nếu bạn cần!\n\nHôm nay công việc và tâm trạng của bạn thế nào? 😊`;
  }

  if (lowerPrompt.includes('bạn tên gì') || lowerPrompt.includes('bạn là ai') || lowerPrompt.includes('giới thiệu')) {
    return `Tôi tên là **DevPilot AI Assistant**! 🤖✨\n\nTôi là một trí tuệ nhân tạo đa năng được tích hợp trên nền tảng DevPilot AI. Tôi có thể làm hai việc rất tốt:\n1. 💬 **Nói chuyện giao tiếp tự nhiên**: Trò chuyện đời thường, giải đáp thắc mắc tổng hợp, tán gẫu, chia sẻ mẹo hay.\n2. 💻 **Chuyên gia Phần mềm**: Viết code (React, Node.js, Python, C++...), thiết kế Database SQL, sinh tài liệu SRS, ERD và review code.\n\nBạn muốn chúng ta trò chuyện về chủ đề gì nào?`;
  }

  if (lowerPrompt.includes('khỏe không') || lowerPrompt.includes('thế nào') || lowerPrompt.includes('tâm sự')) {
    return `Tôi là AI nên luôn sẵn sàng 24/7 ở trạng thái đầy năng lượng để trò chuyện cùng bạn đây! ⚡😊\n\nCảm ơn bạn đã hỏi thăm nhé. Còn bạn thì sao, hôm nay có chuyện gì vui hoặc có dự án nào đang làm muốn chia sẻ với tôi không?`;
  }

  // 2. Programming & Code Queries
  if (lowerPrompt.includes('react') || lowerPrompt.includes('next.js') || lowerPrompt.includes('frontend') || lowerPrompt.includes('component')) {
    return `Dưới đây là mã nguồn **React / Next.js Component** chuẩn Clean Code & TypeScript:\n\n\`\`\`tsx\nimport React, { useState } from 'react';\n\ninterface Props {\n  title: string;\n}\n\nexport const FeatureCard: React.FC<Props> = ({ title }) => {\n  const [active, setActive] = useState(false);\n\n  return (\n    <div \n      onClick={() => setActive(!active)}\n      className={\`p-4 rounded-xl border transition-all cursor-pointer \${active ? 'bg-cyan-500/20 border-cyan-400' : 'bg-slate-900 border-slate-800'}\`}\n    >\n      <h3 className="text-sm font-bold text-white">{title}</h3>\n      <p className="text-xs text-slate-400 mt-1">Trạng thái: {active ? 'Đã kích hoạt' : 'Chưa chọn'}</p>\n    </div>\n  );\n};\n\`\`\`\n\nBạn có muốn tôi điều chỉnh thêm style hay logic gì cho đoạn code này không?`;
  }

  if (lowerPrompt.includes('sql') || lowerPrompt.includes('database') || lowerPrompt.includes('bảng')) {
    return `Dưới đây là kịch bản **PostgreSQL DDL** được thiết kế chuẩn chuẩn hóa:\n\n\`\`\`sql\n-- Bảng Quản lý Người dùng & Tài khoản\nCREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) NOT NULL UNIQUE,\n  display_name VARCHAR(255),\n  role VARCHAR(50) DEFAULT 'user',\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n-- Bảng Quản lý Nhật ký Thao tác\nCREATE TABLE activity_logs (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES users(id) ON DELETE CASCADE,\n  action VARCHAR(100) NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\`\`\`\n\nBạn có muốn tôi phát triển thêm các bảng liên quan nào không?`;
  }

  // 3. General Natural Response Fallback
  return `Tôi đã nhận được tin nhắn của bạn: "${prompt}".\n\nTôi sẵn sàng trò chuyện cùng bạn về chủ đề này! Bạn có thể chia sẻ thêm thông tin hoặc đặt bất kỳ câu hỏi nào tiếp theo nhé. 😊`;
}

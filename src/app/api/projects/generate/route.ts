import { NextResponse } from 'next/server';
import { AIProviderFactory } from '@/core/ai/factory';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, category } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const aiProvider = AIProviderFactory.getProvider('gemini');

    const systemPrompt = `Bạn là một Senior Software Architect hàng đầu thế giới.
Hãy phân tích yêu cầu dự án: "${prompt}" (Lĩnh vực: ${category || 'Software'}).
Hãy trả về duy nhất 1 JSON object có định dạng chuẩn theo schema sau (không kèm markdown format):
{
  "name": "Tên Dự Án",
  "category": "Lĩnh Vực",
  "architecture": "Layered Architecture / Microservices / Monolith",
  "modules": ["Module 1", "Module 2", "Module 3"],
  "erdMermaid": "erDiagram\\n PATIENTS ||--o{ APPOINTMENTS : has",
  "apiSpecs": [{ "method": "POST", "endpoint": "/api/v1/resource", "desc": "Mô tả" }],
  "sqlSchema": "CREATE TABLE..."
}`;

    let jsonResult;
    try {
      jsonResult = await aiProvider.generateJSON(prompt, undefined, { systemInstruction: systemPrompt });
    } catch (err) {
      // Fallback structured data if API Key not set yet
      jsonResult = {
        name: prompt.includes('bệnh viện') ? 'Hệ Thống Quản Lý Bệnh Viện' : 'Hệ Thống Phần Mềm Phân Tích AI',
        category: category || 'Software Engineering',
        architecture: 'Layered Architecture',
        modules: ['Phân hệ Quản lý Người dùng & Phân quyền', 'Phân hệ Xử lý Nghiệp vụ Chính', 'Phân hệ Thống kê & Báo cáo'],
        erdMermaid: `erDiagram\n    USERS ||--o{ PROJECTS : creates\n    PROJECTS ||--o{ DOCUMENTS : contains`,
        apiSpecs: [
          { method: 'POST', endpoint: '/api/v1/projects/generate', desc: 'Sinh dự án tự động bằng AI' },
          { method: 'GET', endpoint: '/api/v1/projects', desc: 'Tra cứu danh sách dự án' }
        ],
        sqlSchema: `CREATE TABLE projects (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name VARCHAR(255) NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);`
      };
    }

    return NextResponse.json({ success: true, data: jsonResult }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

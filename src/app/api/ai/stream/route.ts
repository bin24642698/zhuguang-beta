/**
 * AI流式API中间层路由
 * 接收前端请求，转发到目标AI服务器，返回流式响应
 */
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// 硬编码的API配置
const API_BASE = "https://bin.2464269801.shop/v1";
const API_KEY = "AIzaSyCEI2oft80S5Lwz6tOIDv927XcsObJXQ94";

// 消息类型
interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

// 请求体类型
interface StreamRequest {
  messages: Message[];
  model: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * 错误处理函数
 */
const handleAIError = (error: any): string => {
  console.error('AI服务错误:', error);
  const errorMessage = error?.message || JSON.stringify(error) || '未知错误';

  if (errorMessage.includes('API key not configured')) {
    return 'API密钥未配置，请联系管理员';
  }
  
  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      return `API认证失败：${error.message} (状态码: ${error.status})，请联系管理员。`;
    }
    if (error.status === 429) {
      return `请求过于频繁：${error.message} (状态码: ${error.status})，请稍后再试。`;
    }
    if (error.code === 'invalid_api_key') {
      return `无效的API密钥：${error.message}。请联系管理员。`;
    }
    return `OpenAI API错误：${error.message} (状态码: ${error.status}, 类型: ${error.type}, Code: ${error.code})`;
  }
  
  if (errorMessage.includes('token') || errorMessage.includes('context_length_exceeded')) {
    return '内容长度超出模型限制，请尝试减少输入内容';
  }
  if (errorMessage.includes('network') || errorMessage.includes('timeout') || errorMessage.includes('fetch failed')) {
    return '网络连接错误，请检查您的网络连接或API Base URL是否正确，并重试';
  }
  if (errorMessage.includes('authentication') || errorMessage.includes('认证')) {
    return 'API认证失败，请联系管理员';
  }
  
  return `生成内容失败: ${errorMessage}`;
};

/**
 * 创建OpenAI客户端实例
 */
const createOpenAIClient = (): OpenAI => {
  return new OpenAI({
    apiKey: API_KEY,
    baseURL: API_BASE,
  });
};

/**
 * POST 方法处理流式AI请求
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body: StreamRequest = await request.json();
    const { messages, model, temperature = 0.7, max_tokens = 64000 } = body;

    // 验证请求参数
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: '消息数组不能为空' },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json(
        { error: '模型参数不能为空' },
        { status: 400 }
      );
    }

    console.log(`后端流式生成使用模型: ${model}`);
    console.log("后端发送流式请求:", {
      model,
      messages: messages.map(m => ({ 
        role: m.role, 
        content: m.role === 'system' ? '(系统提示词)' : m.content 
      })),
      temperature
    });

    // 创建OpenAI客户端
    const client = createOpenAIClient();

    // 调用OpenAI流式API
    const stream = await client.chat.completions.create({
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature,
      max_tokens,
      stream: true,
      stream_options: { include_usage: true }
    });

    console.log("后端Stream created successfully");

    // 创建可读流来转发响应
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';

            // 处理普通内容
            if (content) {
              const encoder = new TextEncoder();
              controller.enqueue(encoder.encode(content));
            }

            // 处理usage信息（在最后一个chunk中）
            if (chunk.usage) {
              console.log("后端收到usage信息:", chunk.usage);
              const encoder = new TextEncoder();
              // 发送特殊标记的usage信息
              const usageData = `\n__USAGE_DATA__:${JSON.stringify(chunk.usage)}`;
              controller.enqueue(encoder.encode(usageData));
            }
          }
          controller.close();
        } catch (error) {
          console.error("后端流式处理错误:", error);
          const errorMessage = handleAIError(error);
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`\n\nERROR: ${errorMessage}`));
          controller.close();
        }
      }
    });

    // 返回流式响应
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("后端API请求错误:", error);
    
    // 添加更详细的错误信息
    if (error.status) console.error(`错误状态码: ${error.status}`);
    if (error.message) console.error(`错误消息: ${error.message}`);
    if (error.code) console.error(`错误代码: ${error.code}`);
    if (error.type) console.error(`错误类型: ${error.type}`);

    const errorMessage = handleAIError(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

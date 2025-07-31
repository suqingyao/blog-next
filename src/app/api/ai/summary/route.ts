import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// 初始化OpenAI客户端，配置为使用讯飞星火API
// 讯飞星火使用APIPassword作为认证密钥，这是在控制台获取的APIPassword
const sparkApiPassword = process.env.SPARK_API_PASSWORD;

console.log('讯飞星火API配置状态:', {
  apiPassword: sparkApiPassword ? '已设置' : '未设置'
});

// 检查必要的环境变量
if (!sparkApiPassword) {
  console.error('讯飞星火API配置不完整：缺少SPARK_API_PASSWORD');
}

/**
 * 初始化OpenAI客户端，配置为使用讯飞星火的兼容接口
 * 讯飞星火提供了兼容OpenAI格式的API端点
 * 使用控制台获取的APIPassword作为api_key
 */
const openai = new OpenAI({
  apiKey: sparkApiPassword,
  baseURL: 'https://spark-api-open.xf-yun.com/v1/'
});

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // 调用讯飞星火API生成摘要，添加超时控制
    console.log('开始调用讯飞星火API生成摘要...');
    console.log('准备调用讯飞星火API，内容长度:', content.length);

    let apiPromise;
    try {
      apiPromise = openai.chat.completions.create({
        model: '4.0Ultra', // 讯飞星火4.0 Ultra模型
        messages: [
          {
            role: 'system',
            content:
              '你是一个专业的文章摘要生成器。请为以下文章内容生成一个简洁、准确的摘要，不超过100个字。'
          },
          {
            role: 'user',
            content: content
          }
        ]
      });

      console.log('讯飞星火API请求已发送，等待响应...');
    } catch (initError) {
      console.error('创建讯飞星火API请求时出错:', initError);
      throw initError;
    }

    const response = await apiPromise;
    console.log('🚀 ~ POST ~ response:', response);
    const summary = response.choices[0]?.message?.content?.trim() || '';
    console.log('🚀 ~ POST ~ summary:', summary);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);

    // 提供更详细的错误信息
    let errorMessage = 'Failed to generate summary';
    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`;
    }

    // 如果是超时错误，返回特定的错误信息
    if (error instanceof Error && error.message === '讯飞星火API请求超时') {
      return NextResponse.json(
        {
          error: errorMessage,
          summary:
            '由于API请求超时，无法生成AI摘要。这可能是因为网络问题或讯飞星火服务暂时不可用。'
        },
        { status: 504 } // Gateway Timeout
      );
    }

    return NextResponse.json(
      { error: errorMessage, summary: '生成AI摘要时出现错误，请稍后再试。' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 创建标准Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * 用户注册API
 *
 * 请求体:
 * {
 *   email: string;     // 用户邮箱
 *   password: string;  // 用户密码
 *   userId: string;    // 用户名/显示名称
 * }
 *
 * 响应:
 * {
 *   success: boolean;  // 是否成功
 *   message: string;   // 消息
 *   user?: object;     // 用户信息（如果成功）
 *   needsEmailConfirmation?: boolean; // 是否需要邮箱确认
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { email, password, userId } = body;

    // 验证请求数据
    if (!email || !password || !userId) {
      return NextResponse.json(
        { success: false, message: '邮箱、密码和用户名都是必填项' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: '邮箱格式不正确' },
        { status: 400 }
      );
    }

    // 验证邮箱域名
    const allowedDomains = ['qq.com', '163.com', 'gmail.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (!emailDomain || !allowedDomains.includes(emailDomain)) {
      return NextResponse.json(
        { success: false, message: '只支持 @qq.com、@163.com 和 @gmail.com 邮箱注册' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: '密码长度至少为6个字符' },
        { status: 400 }
      );
    }

    // 验证用户名长度
    if (userId.trim().length === 0 || userId.length > 50) {
      return NextResponse.json(
        { success: false, message: '用户名不能为空且长度不能超过50个字符' },
        { status: 400 }
      );
    }

    console.log('开始创建用户:', email);

    // 使用Supabase标准注册API
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userId,
          display_name: userId,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
      }
    });

    if (error) {
      console.error('注册失败:', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    console.log('用户注册请求成功处理');

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '注册成功，请验证您的邮箱',
      user: data.user,
      needsEmailConfirmation: !data.session // 如果没有session，说明需要邮箱确认
    });
  } catch (error) {
    console.error('注册API异常:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

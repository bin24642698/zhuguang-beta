'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * 认证回调页面
 * 处理邮箱验证后的重定向
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('正在处理您的验证请求...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 从URL中获取认证信息
    const handleAuthCallback = async () => {
      try {
        // 获取URL中的认证信息
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        setMessage('邮箱验证成功！正在跳转到登录页面...');
        
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('处理认证回调失败:', error);
        setError(error instanceof Error ? error.message : '验证失败，请重试');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-bg-color flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="ghibli-card p-8 relative">
          <h2 className="text-2xl font-bold text-center mb-6 text-text-dark">
            邮箱验证
          </h2>

          {error ? (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          ) : (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-primary-green hover:underline"
            >
              返回登录页面
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

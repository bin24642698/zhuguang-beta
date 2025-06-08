'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ResetPasswordModal from '@/components/auth/ResetPasswordModal';
import { validateEmailDomain } from '@/lib/utils/validators';

/**
 * 登录页面
 */
export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // 计算字符串的显示长度，汉字算2个字符，其他字符算1个
  const getDisplayLength = (str: string): number => {
    let length = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode >= 0x4e00 && charCode <= 0x9fff) { // 常用汉字范围
        length += 2;
      } else {
        length += 1;
      }
    }
    return length;
  };

  // 如果已登录，跳转到首页
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // 处理表单提交
  const { signIn, signUp } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 验证邮箱格式
      const emailError = validateEmailDomain(email);
      if (emailError) {
        setError(emailError);
        setIsSubmitting(false);
        return;
      }

      if (isLogin) {
        // 登录
        await signIn(email, password);
        router.push('/');
      } else {
        // 注册
        const trimmedDisplayName = displayName.trim();
        if (!trimmedDisplayName) {
          setError('请输入用户名');
          setIsSubmitting(false);
          return;
        }

        const currentDisplayLength = getDisplayLength(trimmedDisplayName);
        if (currentDisplayLength > 16) { // 校验最大长度
          setError('用户名过长，最多16个字符（汉字算2个字符）');
          setIsSubmitting(false);
          return;
        }

        // 注册用户
        const result = await signUp(email, password, trimmedDisplayName);

        // 检查是否需要邮箱确认
        if (result && result.needsEmailConfirmation) {
          // 注册成功，但需要邮箱确认
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setDisplayName('');
          setError('注册成功！请查收验证邮件，验证邮箱后再登录。');
          return;
        }

        // 如果不需要邮箱确认（已经自动登录），跳转到首页
        router.push('/');
      }
    } catch (error) {
      console.error('认证失败:', error);
      setError(error instanceof Error ? error.message : '认证失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 如果正在加载或已登录，显示加载中
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-color flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-primary-green">
            <svg className="animate-spin h-10 w-10 text-primary-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-color flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="ghibli-card p-8 relative">
          <h2 className="text-2xl font-bold text-center mb-6 text-text-dark">
            {isLogin ? '登录' : '注册'}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-text-medium text-sm font-medium mb-2" htmlFor="displayName">
                  用户名
                </label>
                <input
                  id="displayName"
                  type="text"
                  className="w-full px-4 py-2 bg-white bg-opacity-70 border border-[rgba(120,180,140,0.3)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgba(120,180,140,0.5)] transition-all duration-200 text-text-dark"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isLogin}
                />
                <p className="text-xs text-text-light mt-1">最多16个字符（汉字算2个字符）</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-text-medium text-sm font-medium mb-2" htmlFor="email">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 bg-white bg-opacity-70 border border-[rgba(120,180,140,0.3)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgba(120,180,140,0.5)] transition-all duration-200 text-text-dark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-text-medium text-sm font-medium mb-2" htmlFor="password">
                密码
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 bg-white bg-opacity-70 border border-[rgba(120,180,140,0.3)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgba(120,180,140,0.5)] transition-all duration-200 text-text-dark"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-green text-white py-2 px-4 rounded-full hover:bg-[#4a8d5b] transition-colors duration-200 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
              ) : (isLogin ? '登录' : '注册')}
            </button>

            <div className="mt-4 text-center flex justify-between">
              <button
                type="button"
                className="text-primary-green hover:underline text-sm"
                onClick={() => setShowResetPassword(true)}
              >
                忘记密码？
              </button>
              <button
                type="button"
                className="text-primary-green hover:underline text-sm"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  // 切换模式时清除表单
                  if (isLogin) {
                    setDisplayName('');
                  }
                }}
              >
                {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
              </button>
            </div>
          </form>

          <div className="page-curl"></div>
        </div>
      </div>

      {/* 重置密码弹窗 */}
      <ResetPasswordModal
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
        onBackToLogin={() => setShowResetPassword(false)}
      />
    </div>
  );
}

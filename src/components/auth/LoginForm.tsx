'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { validateEmailDomain } from '@/lib/utils/validators';

/**
 * 登录表单组件
 */

/**
 * 计算字符串的显示长度，汉字算2个字符，其他字符算1个
 * @param str 要计算的字符串
 * @returns 显示长度
 */
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

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 验证邮箱格式
      const emailError = validateEmailDomain(email);
      if (emailError) {
        setError(emailError);
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        // 登录
        await signIn(email, password);
        // 登录成功，跳转到首页
        router.push('/');
      } else {
        // 注册
        const trimmedDisplayName = displayName.trim();
        if (!trimmedDisplayName) {
          setError('请输入用户名');
          setIsLoading(false);
          return;
        }

        const currentDisplayLength = getDisplayLength(trimmedDisplayName);
        if (currentDisplayLength > 16) { // 校验最大长度
          setError('用户名过长，最多16个字符（汉字算2个字符）');
          setIsLoading(false);
          return;
        }

        // 添加更安全的错误处理
        const result = await signUp(email, password, trimmedDisplayName);

        // 确保结果存在
        if (!result || !result.user) {
          throw new Error('注册失败，请稍后重试');
        }

        // 检查是否需要邮箱确认
        if (result.needsEmailConfirmation) {
          // 注册成功，但需要邮箱确认
          setIsLogin(true); // 切换到登录模式
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
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="ghibli-card p-8">
        <div className="tape" style={{ backgroundColor: 'rgba(90,157,107,0.7)' }}>
          <div className="tape-texture"></div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-text-dark">
          {isLogin ? '登录' : '注册'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-text-medium text-sm font-medium mb-2" htmlFor="displayName">
                用户名（显示名称）
              </label>
              <input
                id="displayName"
                type="text"
                className="w-full px-4 py-2 bg-white bg-opacity-70 border border-[rgba(120,180,140,0.3)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgba(120,180,140,0.5)] transition-all duration-200 text-text-dark"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="设置您的显示名称"
                required={!isLogin}
              />
              <p className="text-text-light text-xs mt-1">最多16个字符（汉字算2个字符）</p>
            </div>
          )}

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
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中...
              </span>
            ) : (
              isLogin ? '登录' : '注册'
            )}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-primary-green hover:underline text-sm"
              onClick={() => {
                setIsLogin(!isLogin);
                // 切换模式时清除用户名
                if (isLogin) {
                  setDisplayName('');
                }
              }}
            >
              {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

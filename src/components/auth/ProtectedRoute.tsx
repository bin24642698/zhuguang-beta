'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 受保护的路由组件
 * 用于保护需要登录才能访问的页面
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showLoading, setShowLoading] = React.useState(false);

  // 定义公共路径数组，这些路径不需要登录即可访问
  const publicPaths = ['/login', '/reset-password'];

  // 检查当前路径是否是公共路径
  const isPublicPath = publicPaths.includes(pathname);

  // 如果未登录且不在加载中，且不是公共路径，重定向到登录页
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicPath) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, pathname, isPublicPath]);

  // 延迟显示加载状态，避免闪烁
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      // 如果已经有会话，可能是已登录状态，不立即显示加载
      if (session) {
        return;
      }

      // 延迟200毫秒显示加载状态，避免短暂的加载闪烁
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 200);
    } else {
      setShowLoading(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, session]);

  // 如果在加载中且需要显示加载状态
  if (isLoading && showLoading) {
    return (
      <div className="min-h-screen bg-bg-color flex items-center justify-center">
        <div className="animate-pulse text-primary-green">
          <svg className="animate-spin h-10 w-10 text-primary-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  // 如果在加载中但有会话，或者已认证，或者是公共路径，显示子组件
  if ((isLoading && session) || isAuthenticated || isPublicPath) {
    return <>{children}</>;
  }

  // 如果未认证且不在加载中，且不是公共路径，返回null
  return null;
}

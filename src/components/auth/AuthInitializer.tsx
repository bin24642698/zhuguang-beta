'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/slices/authSlice';

/**
 * 认证初始化组件
 * 在应用启动时初始化认证状态，只需要在应用根组件中使用一次
 */
export default function AuthInitializer() {
  const { initialize } = useAuthStore();

  // 在应用启动时初始化认证状态
  useEffect(() => {
    console.log('Initializing auth state...');
    initialize();
  }, [initialize]);

  // 这个组件不渲染任何内容
  return null;
}

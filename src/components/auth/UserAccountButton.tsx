'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import RechargeModal from '@/components/common/modals/RechargeModal';
import { supabase } from '@/lib/supabase';

/**
 * 用户账号按钮组件
 * 登录后显示用户账号信息
 */
export default function UserAccountButton() {
  const { user, signOut } = useAuth();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [membershipInfo, setMembershipInfo] = useState(null);
  const [wordCountInfo, setWordCountInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 使用ref来跟踪窗口是否已经获取过数据
  const hasLoadedRef = useRef(false);
  // 使用ref来跟踪窗口是否已经打开
  const wasOpenRef = useRef(false);

  // 获取会员信息和字数信息
  useEffect(() => {
    // 只有当窗口打开且之前是关闭状态时才获取数据
    if (showUserInfo && user && (!wasOpenRef.current || !hasLoadedRef.current)) {
      // 标记窗口已经打开
      wasOpenRef.current = true;

      // 如果没有缓存数据，才设置加载状态
      if (!membershipInfo && !wordCountInfo) {
        setIsLoading(true);
      }

      // 获取会员信息
      const fetchMembershipInfo = async () => {
        try {
          const { data: memberData, error: memberError } = await supabase
            .from('huiyuan')
            .select('*')
            .eq('id', user.id)
            .single();

          if (memberError) {
            console.error('获取会员信息失败:', memberError);
          } else {
            setMembershipInfo(memberData);
          }

          // 获取字数信息
          const { data: wordData, error: wordError } = await supabase
            .from('zishu')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (wordError) {
            console.error('获取字数信息失败:', wordError);
          } else {
            setWordCountInfo(wordData);
          }

          // 标记已经加载过数据
          hasLoadedRef.current = true;
        } catch (error) {
          console.error('获取用户信息失败:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMembershipInfo();
    }

    // 当窗口关闭时，重置窗口打开状态
    if (!showUserInfo) {
      wasOpenRef.current = false;
    }
  }, [showUserInfo, user, membershipInfo, wordCountInfo]);

  // 如果用户未登录，返回null
  if (!user) return null;

  // 用户ID和UID
  const userId = user.user_metadata?.display_name || user.user_metadata?.name || '未设置';
  const uid = user.id;

  // 格式化会员级别显示
  const formatMemberLevel = (level) => {
    switch (level) {
      case 'free': return '免费会员';
      case 'normal': return '普通会员';
      case 'gold': return '黄金会员';
      case 'black_gold': return '黑金会员';
      default: return level;
    }
  };

  // 格式化数字显示（添加千位分隔符）
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="relative">
      {/* 用户账号按钮 */}
      <button
        className="flex items-center space-x-1 text-text-dark hover:text-primary-green transition-colors duration-200"
        onClick={() => setShowUserInfo(!showUserInfo)}
      >
        <span className="material-icons text-xl">account_circle</span>
        <span>我的账号</span>
      </button>

      {/* 用户信息弹窗 */}
      {showUserInfo && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-50 border border-[rgba(120,180,140,0.3)]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-text-dark">账号信息</h3>
            <button
              className="text-text-medium hover:text-text-dark"
              onClick={() => setShowUserInfo(false)}
            >
              <span className="material-icons text-sm">close</span>
            </button>
          </div>

          <div className="mb-4">
            <div className="mb-2">
              <p className="text-xs text-text-medium">用户ID（显示名称）</p>
              <p className="text-sm font-medium text-text-dark">{userId}</p>
            </div>
            <div className="mb-2">
              <p className="text-xs text-text-medium">UID</p>
              <p className="text-sm font-medium text-text-dark break-all">{uid}</p>
            </div>

            {/* 会员信息 */}
            {membershipInfo && (
              <div className="mb-2 mt-3 p-2 bg-[rgba(120,180,140,0.1)] rounded-md">
                <p className="text-xs text-text-medium mb-1">会员信息</p>
                <p className="text-sm text-text-dark">
                  <span className="font-medium">{formatMemberLevel(membershipInfo.level)}</span>
                  {membershipInfo.level !== 'free' && membershipInfo.subscription_end_date && (
                    <span className="text-xs ml-1 text-text-medium">
                      (到期: {new Date(membershipInfo.subscription_end_date).toLocaleDateString()})
                    </span>
                  )}
                </p>
                {membershipInfo.level !== 'free' && (
                  <div className="mt-1 text-xs">
                    <p className="flex justify-between">
                      <span className="text-text-medium">剩余字数:</span>
                      <span className="text-text-dark font-medium">{formatNumber(membershipInfo.remaining_monthly_quota)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-text-medium">今日剩余次数:</span>
                      <span className="text-text-dark font-medium">{membershipInfo.remaining_daily_usage}/{membershipInfo.daily_usage_limit}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 字数信息 */}
            {wordCountInfo && (
              <div className="mb-2 p-2 bg-[rgba(120,180,140,0.1)] rounded-md">
                <p className="text-xs text-text-medium mb-1">字数额度</p>
                <div className="text-xs">
                  <p className="flex justify-between">
                    <span className="text-text-medium">剩余字数:</span>
                    <span className="text-text-dark font-medium">{formatNumber(wordCountInfo.remaining_quota)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-text-medium">今日剩余次数:</span>
                    <span className="text-text-dark font-medium">{wordCountInfo.remaining_daily_usage}/{wordCountInfo.daily_usage_limit}</span>
                  </p>
                </div>
              </div>
            )}

            {/* 只有在没有任何数据且正在加载时才显示加载状态 */}
            {isLoading && !membershipInfo && !wordCountInfo && (
              <div className="py-2 text-center text-text-medium text-sm">
                <span>加载中...</span>
              </div>
            )}
          </div>

          {/* 充值按钮 */}
          <button
            className="w-full bg-blue-500 text-white py-1.5 px-4 rounded-full hover:bg-blue-600 transition-colors duration-200 text-sm mb-2"
            onClick={() => {
              setShowRechargeModal(true);
              setShowUserInfo(false); // 关闭用户信息弹窗
            }}
          >
            充值
          </button>

          <button
            className="w-full bg-primary-green text-white py-1.5 px-4 rounded-full hover:bg-[#4a8d5b] transition-colors duration-200 text-sm"
            onClick={() => {
              signOut();
              setShowUserInfo(false);
            }}
          >
            退出登录
          </button>
        </div>
      )}

      {/* 充值模态窗口 */}
      <RechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
      />
    </div>
  );
}

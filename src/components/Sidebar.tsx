'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';

// 侧边栏收起状态的localStorage键
const SIDEBAR_COLLAPSED_KEY = 'sidebar_collapsed';

interface SidebarProps {
  activeMenu?: string;
  // 章节管理相关属性
  chapters?: Array<{title: string, content: string}>;
  activeChapter?: number;
  onChapterClick?: (index: number) => void;
  onAddChapter?: () => void;
  isDescending?: boolean;
  setIsDescending?: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export default function Sidebar({
  activeMenu = 'works',
  chapters = [],
  activeChapter = 0,
  onChapterClick,
  onAddChapter,
  isDescending = false,
  setIsDescending
}: SidebarProps) {
  // 创建一个颜色数组用于章节项
  const chapterColors = [
    'rgba(120,180,140,0.3)', // 绿色
    'rgba(133,150,230,0.3)', // 蓝色
    'rgba(224,149,117,0.3)', // 橙色
    'rgba(194,129,211,0.3)', // 紫色
    'rgba(231,169,85,0.3)',  // 黄色
  ];

  const router = useRouter();
  const pathname = usePathname();
  const { isFirstVisit } = useNavigation();

  // 判断是否在作品编辑页面
  const isWorkDetailPage = pathname?.startsWith('/works/') && pathname !== '/works';

  // 使用 useState 初始化为 false，然后在 useEffect 中从 localStorage 加载
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 在客户端加载时从 localStorage 获取状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (savedState === 'true') {
        setIsCollapsed(true);
      }
    }
  }, []);

  // 导航处理函数
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // 当前路径
  const isActive = (path: string): boolean => {
    if (!pathname) return false;
    return pathname === path;
  };

  // 当收起状态变化时，保存到 localStorage 并调整主内容区域的边距
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, isCollapsed.toString());

      // 获取所有主内容区域元素并调整其样式
      const mainContentAreas = document.querySelectorAll('.main-content-area');
      if (mainContentAreas.length > 0) {
        mainContentAreas.forEach(mainContent => {
          if (isCollapsed) {
            // 收起侧边栏时，让主内容区域占满全部宽度且不留边距
            mainContent.setAttribute('style', 'width: 100%; margin-left: 0;');
          } else {
            // 展开侧边栏时，恢复主内容区域宽度和左边距
            mainContent.setAttribute('style', 'width: calc(100% - 16rem); margin-left: 16rem;');
          }
        });
      }
    }
  }, [isCollapsed]);

  return (
    <>
      {/* 收起状态下只显示展开按钮 */}
      {isCollapsed ? (
        <button
          className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-card-color p-1.5 rounded-r-lg shadow-md border border-l-0 border-accent-brown/30 text-text-medium hover:text-primary-green transition-colors duration-200 z-[100]"
          onClick={() => setIsCollapsed(false)}
          aria-label="展开侧边栏"
          style={{ marginLeft: '0' }}
        >
          <span className="material-icons">chevron_right</span>
        </button>
      ) : (
        <div className="sidebar fixed top-0 left-0 h-screen w-64 border-r border-[rgba(120,180,140,0.2)] bg-card-color shadow-md flex flex-col rounded-tr-2xl rounded-br-2xl transition-all duration-300 z-50" style={{ position: 'fixed' }}>
      <div className="p-5 border-b border-[rgba(120,180,140,0.2)] flex items-center">
        <div className="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center text-white font-bold mr-3 text-base shadow-sm">烛</div>
        <span
          className="text-xl font-medium text-text-dark"
          style={{ fontFamily: "'Ma Shan Zheng', cursive" }}
        >
          烛光写作
        </span>
      </div>

      <div className="flex-1 py-2 px-3 overflow-y-auto flex flex-col">
        {/* 完全分离两种模式 */}
        {isWorkDetailPage && chapters.length > 0 ? (
          /* 章节管理模式 - 仅在作品编辑页面显示 */
          <div className="chapter-management flex-1 flex flex-col">
            <div className="mb-4 px-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-text-medium uppercase tracking-wider mb-2">章节管理</h3>
                <div className="flex items-center">
                  {setIsDescending && (
                    <button
                      onClick={() => setIsDescending(prev => !prev)}
                      className="p-1 rounded-lg text-gray-500 hover:bg-[rgba(90,157,107,0.1)] transition-all mr-2"
                      title={isDescending ? '当前为倒序，点击切换为正序' : '当前为正序，点击切换为倒序'}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {isDescending ? (
                          <path d="M7 3L7 21M7 21L3 17M7 21L11 17M17 21V3M17 3L13 7M17 3L21 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        ) : (
                          <path d="M7 21L7 3M7 3L3 7M7 3L11 7M17 3V21M17 21L13 17M17 21L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        )}
                      </svg>
                    </button>
                  )}
                  {onAddChapter && (
                    <button
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-green text-white hover:bg-[#4a8d5b] transition-colors"
                      onClick={onAddChapter}
                      title="添加新章节"
                    >
                      <span className="material-icons text-sm">add</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 章节列表 */}
            <div className="flex-1">
              {[...chapters]
                .map((chapter, index) => ({ chapter, index }))
                .sort((a, b) => isDescending ? b.index - a.index : a.index - b.index)
                .map(({ chapter, index }) => {
                  return (
                    <div
                      key={index}
                      className={`menu-item ${activeChapter === index ? 'active' : ''}`}
                      onClick={() => onChapterClick && onChapterClick(index)}
                    >
                      <div className="menu-icon">
                        <span className="material-icons text-xl">article</span>
                      </div>
                      <span className="menu-text truncate">第 {index + 1} 章</span>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          /* 普通导航模式 - 在非作品编辑页面显示 */
          <div className="flex flex-col flex-1">
            <div className="mb-4 px-2">
              <h3 className="text-xs font-semibold text-text-medium uppercase tracking-wider mb-2">主要功能</h3>
            </div>

            <div
              className={`menu-item ${activeMenu === 'novel' ? 'active' : ''}`}
              onClick={() => handleNavigation('/')}
            >
              <div className="menu-icon">
                <span className="material-icons text-xl">home</span>
              </div>
              <span className="menu-text">首页</span>
            </div>

            <div
              className={`menu-item ${activeMenu === 'works' || (pathname && pathname.startsWith('/works') && !isWorkDetailPage) ? 'active' : ''}`}
              onClick={() => handleNavigation('/works')}
            >
              <div className="menu-icon">
                <span className="material-icons text-xl">auto_stories</span>
              </div>
              <span className="menu-text">小说创作</span>
            </div>

            <div
              className={`menu-item ${activeMenu === 'creativemap' || (pathname && pathname.startsWith('/creativemap')) ? 'active' : ''}`}
              onClick={() => handleNavigation('/creativemap')}
            >
              <div className="menu-icon">
                <span className="material-icons text-xl">map</span>
              </div>
              <span className="menu-text">创意地图</span>
            </div>

            <div className="mt-6 mb-3 px-2">
              <h3 className="text-xs font-semibold text-text-medium uppercase tracking-wider mb-2">工具</h3>
            </div>

            <div
              className={`menu-item ${activeMenu === 'prompts' || (pathname && pathname.startsWith('/prompts')) ? 'active' : ''}`}
              onClick={() => handleNavigation('/prompts')}
            >
              <div className="menu-icon">
                <span className="material-icons text-xl">edit_note</span>
              </div>
              <span className="menu-text">提示词仓库</span>
            </div>

            <div
              className={`menu-item ${activeMenu === 'booktool' || (pathname && pathname.startsWith('/booktool')) ? 'active' : ''}`}
              onClick={() => handleNavigation('/booktool')}
            >
              <div className="menu-icon">
                <span className="material-icons text-xl">auto_stories</span>
              </div>
              <span className="menu-text">一键拆书</span>
            </div>

            <div
              className={`menu-item ${activeMenu === 'archives' || (pathname && pathname.startsWith('/archives')) ? 'active' : ''}`}
              onClick={() => handleNavigation('/archives')}
            >
              <div className="menu-icon">
                <span className="material-icons text-xl">folder</span>
              </div>
              <span className="menu-text">档案馆</span>
            </div>

            <div className="flex-1"></div>
          </div>
        )}
      </div>

      {/* 收起/展开按钮 */}
      <div className="mt-auto p-3 border-t border-[rgba(120,180,140,0.2)] flex justify-center">
        <button
          className="w-full flex items-center justify-center py-2 rounded-xl text-text-medium hover:bg-[rgba(120,180,140,0.1)] transition-colors duration-200"
          onClick={() => setIsCollapsed(true)}
          aria-label="收起侧边栏"
        >
          <span className="material-icons">chevron_left</span>
          <span className="ml-2">收起</span>
        </button>
      </div>
        </div>
      )}
    </>
  );
}
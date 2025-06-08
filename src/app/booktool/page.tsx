'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import BookToolSidebar from '@/components/booktool/BookToolSidebar';
import BookToolContent from '@/components/booktool/BookToolContent';

// 使用localStorage键
const BOOKTOOL_STORAGE_KEY = 'booktool_state';

// 从localStorage加载状态
const loadStateFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedState = localStorage.getItem(BOOKTOOL_STORAGE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('加载一键拆书状态失败:', error);
    }
  }
  return null;
};

// 保存状态到localStorage
const saveStateToStorage = (state: any) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BOOKTOOL_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('保存一键拆书状态失败:', error);
    }
  }
};

// 清除localStorage中的状态
const clearStoredState = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(BOOKTOOL_STORAGE_KEY);
    } catch (error) {
      console.error('清除一键拆书状态失败:', error);
    }
  }
};

export default function BookToolPage() {
  const router = useRouter();

  // 状态
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [chapters, setChapters] = useState<Array<{id: number, title: string, content: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [focusedChapterId, setFocusedChapterId] = useState<number | null>(null);

  // 处理章节选择
  const handleChapterSelect = (chapterId: number) => {
    setSelectedChapters(prev => {
      if (prev.includes(chapterId)) {
        return prev.filter(id => id !== chapterId);
      } else {
        return [...prev, chapterId];
      }
    });
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedChapters.length === chapters.length) {
      setSelectedChapters([]);
    } else {
      setSelectedChapters(chapters.map(chapter => chapter.id));
    }
  };

  // 处理范围选择
  const handleRangeSelect = (startChapter: number, endChapter: number) => {
    // 获取在范围内的章节ID
    const rangeChapterIds = chapters
      .filter((chapter, index) => {
        // 使用索引+1作为章节编号（从1开始）
        const chapterNumber = index + 1;
        return chapterNumber >= startChapter && chapterNumber <= endChapter;
      })
      .map(chapter => chapter.id);

    // 确保章节ID按照原始顺序排列
    const orderedChapterIds = chapters
      .filter(chapter => rangeChapterIds.includes(chapter.id))
      .map(chapter => chapter.id);

    // 设置选中的章节
    setSelectedChapters(orderedChapterIds);
  };

  // 处理章节点击，设置焦点章节ID
  const handleChapterClick = (chapterId: number) => {
    setFocusedChapterId(chapterId);
  };

  // 处理文件上传成功
  const handleFileUploaded = (
    parsedChapters: Array<{id: number, title: string, content: string}>,
    name: string
  ) => {
    // 清除localStorage中的状态
    clearStoredState();

    // 清除之前的分析结果
    setResult('');

    // 设置新状态
    setChapters(parsedChapters);
    setFileName(name);
    // 默认全选章节
    setSelectedChapters(parsedChapters.map(chapter => chapter.id));
  };

  // 处理AI分析结果
  const handleAnalysisResult = (analysisResult: string) => {
    setResult(analysisResult);
  };

  // 手动重置状态
  const handleReset = () => {
    // 清除状态
    setSelectedChapters([]);
    setChapters([]);
    setResult('');
    setFileName('');
    setIsProcessing(false);

    // 清除localStorage
    clearStoredState();
  };

  // 在组件加载时从localStorage恢复状态
  useEffect(() => {
    const savedState = loadStateFromStorage();
    if (savedState) {
      if (savedState.chapters && Array.isArray(savedState.chapters)) {
        setChapters(savedState.chapters);
      }
      if (savedState.selectedChapters && Array.isArray(savedState.selectedChapters)) {
        setSelectedChapters(savedState.selectedChapters);
      }
      if (savedState.result) {
        setResult(savedState.result);
      }
      if (savedState.fileName) {
        setFileName(savedState.fileName);
      }
    }

    // 监听beforeunload事件，在页面刷新或关闭时清除状态
    const handleBeforeUnload = () => {
      clearStoredState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 监听状态变化并保存到localStorage
  useEffect(() => {
    if (chapters.length > 0 || result) {
      saveStateToStorage({
        chapters,
        selectedChapters,
        result,
        fileName
      });
    }
  }, [chapters, selectedChapters, result, fileName]);

  return (
    <div className="flex h-screen bg-bg-color animate-fadeIn overflow-hidden">
      {/* 背景网格 */}
      <div className="grid-background"></div>

      {/* 装饰元素，在小屏幕上减少数量 */}
      <div className="dot hidden md:block" style={{ top: "120px", left: "15%" }}></div>
      <div className="dot" style={{ bottom: "80px", right: "20%" }}></div>
      <div className="dot hidden md:block" style={{ top: "30%", right: "25%" }}></div>
      <div className="dot hidden md:block" style={{ bottom: "40%", left: "30%" }}></div>

      <svg className="wave hidden md:block" style={{ bottom: "20px", left: "10%" }} width="100" height="20" viewBox="0 0 100 20">
        <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="var(--accent-brown)" strokeWidth="2" />
      </svg>

      {/* 左侧导航栏 */}
      <Sidebar activeMenu="booktool" />

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden main-content-area">
        {/* 顶部导航栏 */}
        <TopBar
          title="一键拆书"
          showBackButton={true}
          onBackButtonClick={() => router.push('/')}
          actions={
            <div className="flex items-center space-x-2">
              {/* 可以添加一些操作按钮 */}
            </div>
          }
        />

        {/* 主要内容区 - 使用大卡片包裹整个内容 */}
        <div className="booktool-container p-4 md:p-6">
          <div className="ghibli-card h-full p-0 flex flex-col relative overflow-hidden">
            <div className="tape -rotate-2 -left-2 -top-2" style={{ backgroundColor: 'rgba(111,156,224,0.7)' }}>
              <div className="tape-texture"></div>
            </div>
            {/* 内容区域 */}
            <div className="booktool-content">
              {/* 左侧章节列表 */}
              <BookToolSidebar
                chapters={chapters}
                selectedChapters={selectedChapters}
                onChapterSelect={handleChapterSelect}
                onSelectAll={handleSelectAll}
                onRangeSelect={handleRangeSelect}
                onChapterClick={handleChapterClick}
              />

              {/* 右侧内容区 */}
              <BookToolContent
                chapters={chapters}
                selectedChapters={selectedChapters}
                result={result}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                onFileUploaded={handleFileUploaded}
                onAnalysisResult={handleAnalysisResult}
                fileName={fileName}
                focusedChapterId={focusedChapterId}
              />
            </div>
            <div className="page-curl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

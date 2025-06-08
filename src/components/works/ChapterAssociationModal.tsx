/**
 * 章节关联模态窗口组件
 */
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/modals';

interface Chapter {
  title: string;
  content: string;
}

interface ChapterAssociationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedChapters: number[], isAutoAssociate: boolean, autoAssociateCount: number) => void;
  chapters: Chapter[];
  initialSelectedChapters: number[];
  isDescending: boolean; // 保留这个参数，因为我们仍然需要知道排序状态
  initialIsAutoAssociate?: boolean;
  initialAutoAssociateCount?: number;
}

/**
 * 章节关联模态窗口组件
 */
export const ChapterAssociationModal: React.FC<ChapterAssociationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  chapters,
  initialSelectedChapters,
  isDescending,
  initialIsAutoAssociate = false,
  initialAutoAssociateCount = 10
}) => {
  // 状态
  const [selectedChapters, setSelectedChapters] = useState<number[]>(initialSelectedChapters);
  const [isAutoAssociate, setIsAutoAssociate] = useState<boolean>(initialIsAutoAssociate);
  const [autoAssociateCount, setAutoAssociateCount] = useState<number>(initialAutoAssociateCount);

  // 当initialSelectedChapters变化时，更新组件内部的selectedChapters状态
  useEffect(() => {
    setSelectedChapters(initialSelectedChapters);
  }, [initialSelectedChapters]);

  // 处理章节选择
  const handleChapterSelect = (index: number) => {
    setSelectedChapters(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // 切换自动关联
  const toggleAutoAssociate = () => {
    const newState = !isAutoAssociate;
    setIsAutoAssociate(newState);

    // 如果关闭自动关联，保持当前选中的章节，但将自动关联计数设为0
    if (!newState) {
      setAutoAssociateCount(0);
    }
  };

  // 关联前N章
  const associateFirstNChapters = (n: number) => {
    if (chapters.length === 0) return;

    // 更新自动关联计数 - 如果当前选中的就是n，则取消选中并设置为0
    if (autoAssociateCount === n) {
      setAutoAssociateCount(0);
      setSelectedChapters([]);
      // 关闭自动关联
      setIsAutoAssociate(false);
      return;
    }

    // 否则设置为新的值
    setAutoAssociateCount(n);
    // 开启自动关联
    setIsAutoAssociate(true);

    // 生成要选择的章节数组
    let chaptersToSelect: number[] = [];

    if (isDescending) {
      // 倒序：选择最后的n章（最新的n章）
      const startIndex = Math.max(0, chapters.length - n);
      chaptersToSelect = Array.from({ length: n }, (_, i) => startIndex + i).filter(i => i < chapters.length);
    } else {
      // 正序：选择前n章（最早的n章）
      chaptersToSelect = Array.from({ length: n }, (_, i) => i).filter(i => i < chapters.length);
    }

    // 选中这些章节
    setSelectedChapters(chaptersToSelect);
  };

  // 确认选择
  const confirmChapterSelection = () => {
    onConfirm(selectedChapters, isAutoAssociate, autoAssociateCount);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E0976F] to-[#e08a58] flex items-center justify-center mr-3 text-white shadow-md">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
                stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 12H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 8H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 16H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 8H7.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 12H7.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16H7.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl text-text-dark font-medium" style={{fontFamily: "'Noto Sans SC', sans-serif"}}>
            选择关联章节
          </span>
        </div>
      }
      footer={
        <div className="flex justify-between items-center pt-3">
          <div className="text-sm text-text-medium flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#E0976F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="#E0976F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="#E0976F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            提示：点击复选框可选择或取消选择章节
          </div>
          <button
            onClick={confirmChapterSelection}
            className="bg-gradient-to-br from-[#E0976F] to-[#e08a58] text-white py-2 px-4 rounded-lg flex items-center hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            确认选择 ({selectedChapters.length} 个章节)
          </button>
        </div>
      }
      maxWidth="max-w-2xl"
    >
      <div className="h-[500px] flex">
        {/* 章节列表 */}
        <div className="w-full flex flex-col h-full">
          <div className="mb-3 flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="text-text-dark font-medium text-base mr-2">章节列表</h3>
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
              已选择: {selectedChapters.length}/{chapters.length}
            </div>
          </div>

          {/* 关联按钮组 */}
          <div className="mb-3 flex flex-wrap gap-2">
            {/* 自动关联开关 */}
            <button
              onClick={toggleAutoAssociate}
              className={`px-4 py-2 rounded-lg flex items-center text-sm transition-all ${isAutoAssociate
                ? 'bg-[#E0976F] text-white'
                : 'bg-[#f0f0f0] text-gray-600 border border-gray-300'}`}
              title="开启后自动将当前选择手动关联变为自动关联"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              自动关联 {isAutoAssociate ? '已开启' : '已关闭'}
            </button>

            {/* 关联章节按钮 */}
            <button
              onClick={() => associateFirstNChapters(5)}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center ${
                autoAssociateCount === 5
                ? 'bg-[#E0976F] text-white'
                : 'bg-[#faf0e6] text-[#E0976F] border border-[#E0976F]/30'}`}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              前5章
            </button>
            <button
              onClick={() => associateFirstNChapters(15)}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center ${
                autoAssociateCount === 15
                ? 'bg-[#E0976F] text-white'
                : 'bg-[#faf0e6] text-[#E0976F] border border-[#E0976F]/30'}`}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              前15章
            </button>
            <button
              onClick={() => associateFirstNChapters(30)}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center ${
                autoAssociateCount === 30
                ? 'bg-[#E0976F] text-white'
                : 'bg-[#faf0e6] text-[#E0976F] border border-[#E0976F]/30'}`}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              前30章
            </button>
            <button
              onClick={() => associateFirstNChapters(50)}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center ${
                autoAssociateCount === 50
                ? 'bg-[#E0976F] text-white'
                : 'bg-[#faf0e6] text-[#E0976F] border border-[#E0976F]/30'}`}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              前50章
            </button>
          </div>

          {/* 章节列表容器 */}
          <div className="scrollable-container flex-1 overflow-auto">
            {chapters.length === 0 ? (
              <div className="text-center py-8 text-text-medium flex flex-col items-center">
                <svg className="w-16 h-16 mb-3 text-text-light opacity-40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 2L14 6.5V17.5L19 13V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-gray-400">没有可选的章节</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {[...chapters]
                  .map((chapter, index) => ({ chapter, index }))
                  .sort((a, b) => isDescending ? b.index - a.index : a.index - b.index)
                  .map(({ chapter, index }) => (
                    <div
                      key={index}
                      className={`group p-3 rounded-lg transition-all cursor-pointer flex items-center ${
                        selectedChapters.includes(index)
                        ? 'bg-[rgba(224,151,111,0.15)] border-l-4 border-[#E0976F]' // 恢复原有选中项样式
                        : 'hover:bg-[rgba(224,151,111,0.08)] border-l-4 border-transparent' // 恢复原有默认和悬停状态
                      }`}
                    >
                      <label className="flex items-start w-full cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedChapters.includes(index)}
                          onChange={() => handleChapterSelect(index)}
                          className="mr-3 mt-1 h-4 w-4 text-[#E0976F] focus:ring-[#E0976F] border-gray-300 rounded cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-text-dark text-sm">
                            第 {index + 1} 章
                          </div>
                          <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {chapter.content ? (
                              chapter.content.substring(0, 60) + (chapter.content.length > 60 ? '...' : '')
                            ) : '(无内容)'}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

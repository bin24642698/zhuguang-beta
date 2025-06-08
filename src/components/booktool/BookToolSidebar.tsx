'use client';

import React, { useState } from 'react';
import ErrorModal from '@/components/common/ErrorModal';

interface BookToolSidebarProps {
  chapters: Array<{id: number, title: string, content: string}>;
  selectedChapters: number[];
  onChapterSelect: (chapterId: number) => void;
  onSelectAll: () => void;
  onRangeSelect: (startChapter: number, endChapter: number) => void;
  onChapterClick?: (chapterId: number) => void; // 新增：点击章节时的回调
}

const BookToolSidebar: React.FC<BookToolSidebarProps> = ({
  chapters,
  selectedChapters,
  onChapterSelect,
  onSelectAll,
  onRangeSelect,
  onChapterClick
}) => {
  // 全选状态
  const allSelected = chapters.length > 0 && selectedChapters.length === chapters.length;

  // 添加状态管理范围选择的输入值
  const [startChapter, setStartChapter] = useState<string>('');
  const [endChapter, setEndChapter] = useState<string>('');

  // 错误提示状态
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  // 是否应该滚动到选中章节的标志
  const [shouldScroll, setShouldScroll] = useState<boolean>(false);

  // 创建章节列表容器的引用
  const chaptersContainerRef = React.useRef<HTMLDivElement>(null);

  // 滚动到第一个选中的章节
  const scrollToFirstSelectedChapter = () => {
    if (chaptersContainerRef.current && selectedChapters.length > 0) {
      // 找到第一个选中章节的DOM元素
      const firstSelectedChapterElement = chaptersContainerRef.current.querySelector(
        `[data-chapter-id="${selectedChapters[0]}"]`
      );

      if (firstSelectedChapterElement) {
        // 滚动到该元素
        firstSelectedChapterElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // 监听shouldScroll变化，只在范围选择时触发滚动
  React.useEffect(() => {
    if (shouldScroll && selectedChapters.length > 0) {
      // 使用较长的延迟确保DOM已更新
      setTimeout(() => {
        scrollToFirstSelectedChapter();
        // 滚动完成后重置标志
        setShouldScroll(false);
      }, 200);
    }
  }, [shouldScroll, selectedChapters]); // 依赖于shouldScroll和selectedChapters

  // 处理范围选择
  const handleRangeSelectClick = () => {
    const start = parseInt(startChapter);
    const end = parseInt(endChapter);

    // 验证输入
    if (isNaN(start) || isNaN(end) || start < 1 || end > chapters.length || start > end) {
      // 设置错误信息并显示错误提示
      setErrorMessage(`请输入有效范围：1-${chapters.length}`);
      setShowError(true);
      return;
    }

    // 设置滚动标志为true，表示应该滚动到选中章节
    setShouldScroll(true);

    // 调用回调函数
    onRangeSelect(start, end);

    // 清空输入框
    setStartChapter('');
    setEndChapter('');

    // 不再需要这里的setTimeout，因为我们已经在useEffect中监听selectedChapters变化
  };

  // 关闭错误提示
  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div className="booktool-sidebar bg-white animate-slideIn">
        {/* 使用Portal渲染的错误提示弹窗 */}
        <ErrorModal
          show={showError}
          message={errorMessage}
          onClose={handleCloseError}
        />

        <div className="booktool-sidebar-header">
          <h3 className="text-lg font-medium text-text-dark flex items-center font-ma-shan">
            <span className="material-icons text-[#6F9CE0] mr-2">menu_book</span>
            章节列表
          </h3>
        </div>

        {chapters.length > 0 ? (
          <div className="p-4 flex flex-col h-full">
            <div className="flex flex-col mb-4 bg-[rgba(111,156,224,0.05)] p-3 rounded-lg border border-[rgba(111,156,224,0.2)] flex-shrink-0">
              <div className="flex items-center mb-2">
                <button
                  className="flex items-center text-sm text-[#6F9CE0] hover:text-[#5A8BD0] transition-colors"
                  onClick={() => {
                    onSelectAll();
                  }}
                >
                  <span className="material-icons text-sm mr-1">
                    {allSelected ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  {allSelected ? '取消全选' : '全选'}
                </button>
                <span className="ml-auto text-sm text-text-light bg-[rgba(111,156,224,0.1)] px-2 py-1 rounded-full">
                  已选择 {selectedChapters.length}/{chapters.length}
                </span>
              </div>

              {/* 范围选择输入框 */}
              <div className="flex items-center mt-2">
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="1"
                    max={chapters.length}
                    value={startChapter}
                    onChange={(e) => setStartChapter(e.target.value)}
                    className="w-20 h-8 text-sm border border-[rgba(111,156,224,0.3)] rounded-md px-2 text-center"
                    placeholder="起始"
                  />
                  <span className="text-text-light">-</span>
                  <input
                    type="number"
                    min="1"
                    max={chapters.length}
                    value={endChapter}
                    onChange={(e) => setEndChapter(e.target.value)}
                    className="w-20 h-8 text-sm border border-[rgba(111,156,224,0.3)] rounded-md px-2 text-center"
                    placeholder="结束"
                  />
                </div>
                <button
                  className="ml-2 px-2 py-1 text-xs bg-[rgba(111,156,224,0.2)] text-[#6F9CE0] rounded-md hover:bg-[rgba(111,156,224,0.3)] transition-colors"
                  onClick={handleRangeSelectClick}
                >
                  选择范围
                </button>
              </div>
            </div>

            <div className="booktool-sidebar-content">
              <div className="chapters-inner-container" ref={chaptersContainerRef}>
              {chapters.map(chapter => (
                <div
                  key={chapter.id}
                  data-chapter-id={chapter.id}
                  className={`p-3 pb-4 mb-2 rounded-lg cursor-pointer transition-all duration-200 flex items-start max-w-[90%] ${
                    selectedChapters.includes(chapter.id)
                      ? 'bg-[rgba(111,156,224,0.1)] border-l-4 border-[#6F9CE0] shadow-sm'
                      : 'hover:bg-[rgba(111,156,224,0.05)] border-l-4 border-transparent'
                  }`}
                  onClick={() => {
                    // 如果章节已经选中，则取消选中；否则选中章节
                    onChapterSelect(chapter.id);

                    // 调用章节点击回调，通知父组件滚动到该章节
                    if (onChapterClick) {
                      onChapterClick(chapter.id);
                    }
                  }}
                >
                  <span className="material-icons text-sm mr-2 mt-1 text-[#6F9CE0]">
                    {selectedChapters.includes(chapter.id) ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <div className="flex-1">
                    <p className="text-text-dark font-medium text-sm truncate max-w-[95%]">{chapter.title}</p>
                    <div className="flex items-center max-w-[90%] mt-2">
                      <span className="material-icons text-[#6F9CE0] text-xs mr-1 flex-shrink-0">schedule</span>
                      <p className="text-text-light text-xs whitespace-nowrap leading-relaxed">
                        {Math.ceil(chapter.content.length / 500)} 分钟阅读
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-text-light">
            <div className="w-16 h-16 rounded-full bg-[rgba(111,156,224,0.1)] flex items-center justify-center mb-3">
              <span className="material-icons text-3xl text-[#6F9CE0]">auto_stories</span>
            </div>
            <p className="text-center font-medium">请先上传TXT文件</p>
            <p className="text-center text-xs mt-2">上传后将在此处显示章节列表</p>
          </div>
        )}
    </div>
  );
};

export default BookToolSidebar;

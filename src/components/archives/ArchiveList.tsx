import React, { useState } from 'react';
import { Archive } from '@/data';
import { creativeMapTypes } from './ArchiveFilters';

// 根据分类获取颜色
export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'worldbuilding':
      return 'rgba(90,157,107,0.7)'; // 绿色
    case 'character':
      return 'rgba(156,111,224,0.7)'; // 紫色
    case 'plot':
      return 'rgba(111,156,224,0.7)'; // 蓝色
    case 'outline':
      return 'rgba(224,151,111,0.7)'; // 橙色
    case 'introduction':
      return 'rgba(224,197,111,0.7)'; // 黄色
    case 'detailed_outline':
      return 'rgba(224,111,156,0.7)'; // 粉色
    case 'book_analysis':
      return 'rgba(75,145,198,0.7)'; // 蓝色（拆书结果）
    default:
      return 'rgba(120,180,140,0.7)'; // 默认绿色
  }
};

// 获取分类名称
export const getCategoryName = (categoryId: string): string => {
  if (categoryId in creativeMapTypes) {
    return creativeMapTypes[categoryId as keyof typeof creativeMapTypes];
  }
  return '未知分类';
};

interface ArchiveListProps {
  archives: Archive[];
  selectedArchive: Archive | null;
  isLoading: boolean;
  selectedWorkId: number | null;
  selectedCategory: string | null;
  onArchiveSelect: (archive: Archive) => void;
  onCreateArchive: () => void;
  onEditTitle?: (archive: Archive) => void;
  onDeleteArchive?: (archive: Archive) => void;
}

const ArchiveList: React.FC<ArchiveListProps> = ({
  archives,
  selectedArchive,
  isLoading,
  selectedWorkId,
  selectedCategory,
  onArchiveSelect,
  onCreateArchive,
  onEditTitle,
  onDeleteArchive
}) => {
  // 添加编辑状态
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  // 处理开始编辑
  const handleStartEdit = (archive: Archive, e: React.MouseEvent) => {
    e.stopPropagation();
    if (archive.id) {
      setEditingId(archive.id);
      setEditingTitle(archive.title);
    }
  };

  // 处理保存编辑
  const handleSaveEdit = (archive: Archive) => {
    if (onEditTitle) {
      // 检查标题是否为空，为空则使用默认名称
      const finalTitle = editingTitle.trim() === '' ? '新建标签页' : editingTitle.trim();
      const updatedArchive = { ...archive, title: finalTitle, updatedAt: new Date() };
      onEditTitle(updatedArchive);
    }
    setEditingId(null);
  };

  // 处理取消编辑
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // 处理失去焦点时的保存
  const handleBlurEdit = (archive: Archive) => {
    // 检查标题是否为空，为空则使用默认名称
    const finalTitle = editingTitle.trim() === '' ? '新建标签页' : editingTitle.trim();

    // 只有在标题确实更改过或从默认空变成默认名时才保存
    if (finalTitle !== archive.title && onEditTitle) {
      const updatedArchive = { ...archive, title: finalTitle, updatedAt: new Date() };
      onEditTitle(updatedArchive);
    }

    setEditingId(null);
  };
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <span className="text-[#7D85CC]">加载中...</span>
        </div>
      ) : archives.length === 0 ? (
        <div className="flex items-center justify-center h-64 flex-col">
          <div className="w-20 h-20 bg-[rgba(125,133,204,0.1)] rounded-full flex items-center justify-center mb-4">
            <span className="material-icons text-4xl text-[rgba(125,133,204,0.3)]">folder_open</span>
          </div>
          <h3 className="text-lg font-medium text-text-dark mb-2 font-ma-shan">
            {selectedWorkId === null ? "档案馆空空如也" : "该作品还没有档案"}
          </h3>
          <p className="text-text-medium text-center max-w-xs mb-6">
            {selectedWorkId === null
              ? "创建你的第一个档案，开始记录创作灵感和素材"
              : "为这个作品创建档案，记录角色、世界观和情节"}
          </p>
          <button
            className={`px-4 py-2 ${
              selectedWorkId === null || selectedCategory === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#7D85CC] text-white hover:bg-[#6b73b3]'
            } rounded-full flex items-center text-sm shadow-sm`}
            onClick={onCreateArchive}
            disabled={selectedWorkId === null || selectedCategory === null}
          >
            <span className="material-icons text-sm mr-1">add</span>
            新建档案
          </button>

        </div>
      ) : (
        <div className="space-y-2">
          {archives.map((archive) => (
            <div
              key={archive.id}
              className={`group p-3 rounded-lg cursor-pointer transition-colors flex items-center ${
                selectedArchive?.id === archive.id
                  ? 'bg-[#d8ddf2] border-l-4 border-[#7D85CC] shadow-sm'
                  : 'bg-[#ebeef8] hover:bg-[#e4e8f6] border-l-4 border-transparent'
              }`}
              onClick={() => onArchiveSelect(archive)}
            >
              {/* 分类图标已移至标题行内 */}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  {editingId === archive.id ? (
                    // 编辑模式 - 与作品编辑器档案馆一致的样式
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 px-2 py-1 text-base font-medium rounded border-0 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-[#7D85CC]"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit(archive);
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      onBlur={() => handleBlurEdit(archive)}
                    />
                  ) : (
                    // 显示模式
                    <>
                      <div className="flex items-center flex-1 overflow-hidden">
                        <div
                          className={`w-6 h-6 rounded-full mr-2.5 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold
                            ${archive.category === 'introduction' ? 'bg-[#71a6d2]' :
                              archive.category === 'outline' ? 'bg-[#7d85cc]' :
                              archive.category === 'detailed_outline' ? 'bg-[#9c6fe0]' :
                              archive.category === 'worldbuilding' ? 'bg-[#e0976f]' :
                              archive.category === 'character' ? 'bg-[#e07f7f]' :
                              archive.category === 'plot' ? 'bg-[#8bad97]' :
                              archive.category === 'book_analysis' ? 'bg-[#4b91c6]' :
                              'bg-[#a0a0a0]'}`}
                          title={getCategoryName(archive.category)}
                        >
                          {getCategoryName(archive.category).charAt(0)}
                        </div>
                        <div className="font-medium truncate text-base">
                          {archive.title || '无标题档案'}
                        </div>
                      </div>

                      {/* 编辑和删除按钮 - 悬停时显示 */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                        <button
                          onClick={(e) => handleStartEdit(archive, e)}
                          className="p-1 rounded-full hover:bg-[rgba(125,133,204,0.2)] text-[#7D85CC]"
                          title="编辑标题"
                        >
                          <span className="material-icons text-sm">edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteArchive) onDeleteArchive(archive);
                          }}
                          className="p-1 rounded-full hover:bg-[rgba(255,100,100,0.2)] text-red-500"
                          title="删除"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* 内容预览和日期 - 仅在非编辑模式下显示 */}
                {editingId !== archive.id && (
                  <div className="relative">
                    <div className="text-sm text-text-medium mt-1 line-clamp-2 pr-16">
                      {archive.content || '暂无内容'}
                    </div>

                    {/* 更新日期 - 右下角 */}
                    <div className="text-xs text-text-light absolute bottom-0 right-0">
                      {new Date(archive.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {/* 标签 - 如果需要显示标签，可以取消注释这段代码
                <div className="flex flex-wrap gap-1 mt-2">
                  {archive.tags && archive.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="text-xs px-1.5 py-0.5 bg-[rgba(125,133,204,0.1)] text-[#7D85CC] rounded-full">
                      {tag}
                    </span>
                  ))}
                  {archive.tags && archive.tags.length > 2 && (
                    <span className="text-xs text-text-light">+{archive.tags.length - 2}</span>
                  )}
                </div>
                */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiveList;

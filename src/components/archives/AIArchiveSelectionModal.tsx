/**
 * AI创作助手档案选择模态窗口组件 - 简化版，仅用于选择档案
 */
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/modals';
import { Archive } from '@/data';
import { getArchivesByWorkId } from '@/data';

interface AIArchiveSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (archive: Archive) => void;
  workId?: number;
  initialSelectedIds?: number[];
}

// 创意地图类型常量
const creativeMapTypes = {
  'introduction': '导语',
  'outline': '大纲',
  'detailed_outline': '细纲',
  'worldbuilding': '世界观',
  'character': '角色',
  'plot': '情节',
  'book_analysis': '拆书结果'
} as const;

// 本地存储键
const LOCAL_STORAGE_KEY = 'last_selected_archive_category';

/**
 * AI创作助手档案选择模态窗口组件 - 简化版，仅用于选择档案
 */
export const AIArchiveSelectionModal: React.FC<AIArchiveSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  workId,
  initialSelectedIds = []
}) => {
  // 状态
  const [archives, setArchives] = useState<Archive[]>([]);
  // 始终默认使用全部分类（null值），不再读取localStorage中的上一次选择
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof creativeMapTypes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArchives, setSelectedArchives] = useState<Archive[]>([]);

  // 加载档案
  const loadArchives = async () => {
    if (!workId) return;

    setIsLoading(true);
    setError('');

    try {
      // 按作品ID加载档案
      let archiveData = await getArchivesByWorkId(workId);

      // 如果选择了分类，则过滤
      if (selectedCategory) {
        archiveData = archiveData.filter(archive => archive.category === selectedCategory);
      }

      // 按 updatedAt 降序排序
      archiveData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      setArchives(archiveData);

      // 更新已选择的档案
      if (initialSelectedIds.length > 0) {
        const selectedOnes = archiveData.filter(archive =>
          archive.id !== undefined && initialSelectedIds.includes(archive.id)
        );
        setSelectedArchives(selectedOnes);
      }

    } catch (error) {
      console.error('加载档案失败:', error);
      setError('加载档案失败，请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };

  // 当模态窗口打开时加载档案
  useEffect(() => {
    if (isOpen) {
      // 每次打开时，确保始终默认使用"全部分类"
      setSelectedCategory(null);
      loadArchives();
      // 关闭时重置状态
      return () => {
        setError('');
        setSearchTerm('');
      };
    }
  }, [isOpen, workId]);

  // 当分类改变时重新加载
  useEffect(() => {
    if (isOpen) {
      loadArchives();
    }
  }, [selectedCategory]);

  // 保存分类选择到本地存储
  // 注意：我们现在只在用户手动选择特定分类时才保存，不保存"全部分类"的选择
  useEffect(() => {
    // 只有当用户选择了特定分类（非null）时才保存到localStorage
    if (typeof window !== 'undefined' && selectedCategory) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, selectedCategory);
      } catch (error) {
        console.error("Error writing to localStorage key " + LOCAL_STORAGE_KEY + ":", error);
      }
    }
  }, [selectedCategory]);

  // 处理分类选择
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    if (category === 'all') {
      setSelectedCategory(null); // 全部分类时设置为null
    } else {
      setSelectedCategory(category as keyof typeof creativeMapTypes);
    }
  };

  // 处理档案点击
  const handleArchiveClick = (archive: Archive) => {
    // 切换选中状态
    const archiveId = archive.id;
    if (archiveId === undefined) return;

    const index = selectedArchives.findIndex(a => a.id === archiveId);

    if (index === -1) {
      // 添加到选中列表
      setSelectedArchives([...selectedArchives, archive]);
      onSelect(archive); // 通知父组件
    } else {
      // 从选中列表移除
      const newSelectedArchives = [...selectedArchives];
      newSelectedArchives.splice(index, 1);
      setSelectedArchives(newSelectedArchives);
      onSelect(archive); // 通知父组件
    }
  };

  // 确认选择
  const handleConfirm = () => {
    onClose();
  };

  // 过滤档案
  const filteredArchives = searchTerm
    ? archives.filter(archive =>
        archive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        archive.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : archives;

  // 获取分类名称
  const getCategoryName = (category: string): string => {
    return creativeMapTypes[category as keyof typeof creativeMapTypes] || '未知分类';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="选择档案"
      footer={
        <div className="flex justify-end pt-2">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-[#7D85CC] text-white rounded-lg hover:bg-[#6b73b3] flex items-center"
          >
            <span className="material-icons mr-1 text-sm">check</span>
            确认选择 ({selectedArchives.length} 个档案)
          </button>
        </div>
      }
      maxWidth="max-w-2xl"
    >
      <div className="flex h-[70vh]">
        {/* 档案列表 */}
        <div className="w-full flex flex-col">
          {/* 搜索和分类选择 - 水平排列 */}
          <div className="mb-4 flex items-center space-x-2">
            {/* 左侧分类选择 */}
            <div className="flex items-center w-1/2 relative">
              <select
                value={selectedCategory || 'all'}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 rounded-lg border border-[rgba(125,133,204,0.3)] focus:outline-none focus:ring-2 focus:ring-[#7D85CC] appearance-none bg-white"
              >
                <option value="all">全部分类</option>
                {Object.entries(creativeMapTypes).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
              <div className="absolute right-2 pointer-events-none">
                <span className="material-icons text-[#7D85CC]">expand_more</span>
              </div>
            </div>

            {/* 右侧搜索框 */}
            <input
              type="text"
              placeholder="搜索档案..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-1/2 px-4 py-2 rounded-lg border border-[rgba(125,133,204,0.3)] focus:outline-none focus:ring-2 focus:ring-[#7D85CC]"
            />
          </div>

          {/* 档案列表 */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <span className="text-[#7D85CC]">加载中...</span>
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center">
                <span className="text-red-500">{error}</span>
              </div>
            ) : filteredArchives.length === 0 ? (
              <div className="h-full flex items-center justify-center flex-col">
                <span className="material-icons text-4xl text-[rgba(125,133,204,0.3)] mb-2">folder_open</span>
                <span className="text-text-light text-center">
                  {workId !== undefined
                    ? '此作品还没有档案'
                    : '没有找到档案'
                  }
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredArchives.map(archive => {
                  const isSelected = selectedArchives.some(a => a.id === archive.id);

                  return (
                    <div
                      key={archive.id}
                      className={`group p-3 rounded-lg transition-colors cursor-pointer flex items-center ${
                        isSelected
                        ? 'bg-[#dfe3f5] border-l-4 border-[#7D85CC]' // 选中项的样式
                        : 'bg-[#ebeef8] hover:bg-[#e4e8f6] border-l-4 border-transparent' // 默认样式
                      }`}
                      onClick={() => handleArchiveClick(archive)}
                    >
                      {/* 复选框 - 垂直居中 */}
                      <div className="flex items-center h-full">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="mr-3 h-4 w-4 text-[#7D85CC] focus:ring-[#7D85CC] border-gray-300 rounded cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveClick(archive);
                          }}
                        />
                      </div>

                      {/* 档案信息 */}
                      <div className="flex items-center flex-1 min-w-0">
                        {/* 圆形分类标识 */}
                        <div
                          className={`w-6 h-6 rounded-full mr-2.5 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold
                              ${archive.category === 'introduction' ? 'bg-[#71a6d2]' :
                                archive.category === 'outline' ? 'bg-[#7d85cc]' :
                                archive.category === 'detailed_outline' ? 'bg-[#9c6fe0]' :
                                archive.category === 'worldbuilding' ? 'bg-[#e0976f]' :
                                archive.category === 'character' ? 'bg-[#e07f7f]' :
                                archive.category === 'plot' ? 'bg-[#8bad97]' :
                                archive.category === 'book_analysis' ? 'bg-[#a0a0a0]' :
                                'bg-[#a0a0a0]'}`}
                          title={creativeMapTypes[archive.category as keyof typeof creativeMapTypes] ?? '未知分类'}
                        >
                          {/* 确保 category 是 creativeMapTypes 的有效键 */}
                          {creativeMapTypes[archive.category as keyof typeof creativeMapTypes]?.charAt(0) ?? '?'}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* 标题 */}
                          <div className="font-medium text-text-dark truncate">
                            {archive.title}
                          </div>

                          {/* 内容预览和日期 */}
                          <div className="relative">
                            {/* 内容预览 */}
                            <div className="text-sm text-text-medium mt-1 line-clamp-2 pr-16">
                              {archive.content}
                            </div>

                            {/* 更新日期 - 右下角 */}
                            <div className="text-xs text-text-light absolute bottom-0 right-0">
                              {new Date(archive.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

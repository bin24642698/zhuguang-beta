import React from 'react';
import { Work } from '@/data';

// 创意地图类型常量
export const creativeMapTypes = {
  'introduction': '导语',
  'outline': '大纲',
  'detailed_outline': '细纲',
  'worldbuilding': '世界观',
  'character': '角色',
  'plot': '情节',
  'book_analysis': '拆书结果'
} as const;

interface ArchiveFiltersProps {
  works: Work[];
  selectedWorkId: number | null;
  selectedCategory: string | null;
  archivesCount: number;
  searchTerm: string;
  onWorkChange: (workId: number | null) => void;
  onCategoryChange: (category: string | null) => void;
  onSearchChange: (term: string) => void;
}

const ArchiveFilters: React.FC<ArchiveFiltersProps> = ({
  works,
  selectedWorkId,
  selectedCategory,
  archivesCount,
  searchTerm,
  onWorkChange,
  onCategoryChange,
  onSearchChange
}) => {
  return (
    <div className="p-4 border-b border-[rgba(125,133,204,0.1)] bg-[rgba(125,133,204,0.03)] flex flex-col">
      {/* 作品和分类选择区域 */}
      <div className="flex flex-col space-y-3 bg-[rgba(125,133,204,0.05)] p-3 rounded-lg border border-[rgba(125,133,204,0.2)]">
        {/* 作品选择下拉菜单 */}
        <div className="flex items-center">
          <span className="material-icons text-[#7D85CC] mr-2 text-sm">book</span>
          <label className="text-sm text-text-medium font-medium whitespace-nowrap mr-2">作品:</label>
          <div className="relative flex-1">
            <select
              className="w-full text-sm bg-white border border-[rgba(125,133,204,0.3)] rounded-lg px-3 py-1.5 focus:border-[#7D85CC] focus:outline-none appearance-none pr-8"
              value={selectedWorkId || ""}
              onChange={(e) => onWorkChange(Number(e.target.value))}
            >
              {works.map((work) => (
                <option key={work.id} value={work.id}>{work.title}</option>
              ))}
            </select>
            <span className="material-icons text-[#7D85CC] text-sm absolute right-2 top-1.5 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* 分类选择下拉菜单 */}
        <div className="flex items-center">
          <span className="material-icons text-[#7D85CC] mr-2 text-sm">category</span>
          <label className="text-sm text-text-medium font-medium whitespace-nowrap mr-2">分类:</label>
          <div className="relative flex-1">
            <select
              className="w-full text-sm bg-white border border-[rgba(125,133,204,0.3)] rounded-lg px-3 py-1.5 focus:border-[#7D85CC] focus:outline-none appearance-none pr-8"
              value={selectedCategory || ""}
              onChange={(e) => onCategoryChange(e.target.value || null)}
            >
              <option value="">全部分类</option>
              {Object.entries(creativeMapTypes).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
            <span className="material-icons text-[#7D85CC] text-sm absolute right-2 top-1.5 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* 档案数量显示 */}
        <div className="flex justify-end">
          <span className="text-sm text-text-light bg-[rgba(125,133,204,0.1)] px-2 py-1 rounded-full">
            共 {archivesCount} 个档案
          </span>
        </div>
      </div>


    </div>
  );
};

export default ArchiveFilters;

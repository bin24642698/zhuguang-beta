import React, { useState } from 'react';
import { Archive } from '@/data';
import { getCategoryName } from './ArchiveList';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface ArchiveContentProps {
  archive: Archive;
  isSaving: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave?: () => void;
  onDelete?: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
}

const ArchiveContent: React.FC<ArchiveContentProps> = ({
  archive,
  isSaving,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete,
  onAddTag,
  onRemoveTag
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      onAddTag(newTagInput.trim());
      setNewTagInput('');
    }
  };

  return (
    <>
      {/* 档案标题和操作区 */}
      <div className="p-5 border-b border-[rgba(125,133,204,0.2)] bg-[rgba(125,133,204,0.03)] flex justify-between items-center">
        <div className="flex items-center flex-1">
          <div
            className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mr-3
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
          <input
            type="text"
            value={archive.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="输入档案标题..."
            className="w-full text-xl font-medium text-text-dark bg-transparent border-none focus:outline-none focus:ring-0 font-ma-shan"
          />
        </div>
        <div className="flex items-center">
          {isSaving ? (
            <span className="text-[#7D85CC] flex items-center text-sm">
              <span className="material-icons text-sm mr-1 animate-spin">sync</span>
              保存中...
            </span>
          ) : (
            <span className="flex items-center text-sm text-[#7D85CC]">
              <span className="material-icons text-sm mr-1">check_circle</span>
              自动保存
            </span>
          )}
        </div>
      </div>



      {/* 档案内容编辑区 */}
      <div className="flex-1 p-6 overflow-y-auto relative">
        <textarea
          value={archive.content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="输入档案内容..."
          className="w-full h-full p-4 bg-white border border-[rgba(125,133,204,0.2)] rounded-lg text-lg focus:outline-none focus:ring-1 focus:ring-[#7D85CC] resize-none shadow-inner"
          style={{
            fontFamily: "'Source Han Sans', 'Noto Sans SC', sans-serif",
            lineHeight: '1.8'
          }}
        ></textarea>
      </div>

      {/* 底部状态栏 */}
      <div className="px-4 py-2 border-t border-[rgba(125,133,204,0.1)] flex justify-between items-center text-xs text-text-light bg-[rgba(125,133,204,0.03)]">
        <div className="flex items-center">
          <span className="material-icons text-[#7D85CC] text-sm mr-1">update</span>
          最后更新: {new Date(archive.updatedAt).toLocaleString()}
        </div>
        <div className="flex items-center">
          {isSaving ? (
            <span className="text-[#7D85CC] flex items-center">
              <span className="material-icons text-xs mr-1 animate-spin">sync</span>
              保存中...
            </span>
          ) : (
            <span className="flex items-center">
              <span className="material-icons text-[#7D85CC] text-xs mr-1">check_circle</span>
              自动保存
            </span>
          )}
        </div>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && onDelete && (
        <DeleteConfirmDialog
          title={archive.title}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDelete();
          }}
        />
      )}
    </>
  );
};

export default ArchiveContent;

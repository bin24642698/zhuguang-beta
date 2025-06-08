'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';


interface PromptContentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
}

/**
 * 提示词内容编辑弹窗组件
 */
export function PromptContentEditModal({
  isOpen,
  onClose,
  content,
  onChange,
  onSave
}: PromptContentEditModalProps) {
  // 添加客户端渲染检查
  const [isMounted, setIsMounted] = useState(false);
  const [currentContent, setCurrentContent] = useState('');

  // 初始化内容
  useEffect(() => {
    if (isOpen && content) {
      setCurrentContent(content);
    }
  }, [isOpen, content]);

  useEffect(() => {
    setIsMounted(true);

    // 当模态窗口打开时，禁止body滚动
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    // 清理函数：当组件卸载或模态窗口关闭时，恢复body滚动
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 处理内容变更
  const handleContentChange = (newContent: string) => {
    setCurrentContent(newContent);
  };

  // 保存时传递内容
  const handleSave = () => {
    onChange(currentContent);
    onSave();
    onClose();
  };

  // 如果模态窗口未打开或组件未挂载，不渲染任何内容
  if (!isOpen || !isMounted) return null;

  // 使用createPortal将模态窗口渲染到body
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] animate-fadeIn">
      <div className="bg-card-color rounded-2xl w-full max-w-4xl h-[80vh] shadow-xl relative flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-[rgba(120,180,140,0.3)]">
          <h2 className="text-2xl font-bold text-text-dark font-ma-shan">编辑提示词内容</h2>
          <button
            className="text-gray-500 hover:text-gray-700 w-6 flex justify-center"
            onClick={onClose}
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="flex-grow p-6 overflow-hidden">
          <textarea
            className="w-full h-full px-4 py-3 bg-white bg-opacity-70 border border-[rgba(120,180,140,0.3)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgba(120,180,140,0.5)] text-text-dark overflow-y-auto break-words whitespace-pre-wrap resize-none"
            value={currentContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="输入提示词内容..."
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-[rgba(120,180,140,0.3)]">
          <button
            onClick={handleSave}
            className="ghibli-button text-sm py-2"
          >
            保存
          </button>
          <button
            onClick={onClose}
            className="ghibli-button outline text-sm py-2"
          >
            取消
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

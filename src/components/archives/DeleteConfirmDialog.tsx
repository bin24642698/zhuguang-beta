import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DeleteConfirmDialogProps {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  title,
  onCancel,
  onConfirm
}) => {
  // 添加客户端渲染检查
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 当模态窗口打开时，禁止body滚动
    document.body.style.overflow = 'hidden';

    // 清理函数：当组件卸载时，恢复body滚动
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 如果组件未挂载，不渲染任何内容
  if (!isMounted) return null;

  // 使用createPortal将模态窗口渲染到body
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <div className="flex items-center mb-4">
          <span className="material-icons text-red-500 mr-3">warning</span>
          <h3 className="text-lg font-medium text-text-dark font-ma-shan">确认删除</h3>
        </div>
        <p className="text-text-medium mb-6">确定要删除档案 "{title}" 吗？此操作无法撤销。</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
            onClick={onConfirm}
          >
            删除
          </button>
          <button
            className="px-4 py-2 border border-[rgba(125,133,204,0.3)] text-text-medium rounded-full hover:bg-[rgba(125,133,204,0.05)]"
            onClick={onCancel}
          >
            取消
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmDialog;

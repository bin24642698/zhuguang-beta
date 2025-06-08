/**
 * 简单通用模态窗口组件
 * 使用React Portal将模态窗口渲染到body元素，确保背景遮罩层能够完全覆盖整个视口
 */
import React, { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

/**
 * 简单通用模态窗口组件
 * @param props 模态窗口属性
 * @returns 模态窗口组件
 */
export const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-md"
}) => {
  // 添加客户端渲染检查
  const [isMounted, setIsMounted] = useState(false);

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

  // 如果模态窗口未打开或组件未挂载，不渲染任何内容
  if (!isOpen || !isMounted) return null;

  // 使用createPortal将模态窗口渲染到body
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] animate-fadeIn">
      <div className={`bg-white rounded-lg p-6 shadow-lg ${maxWidth} w-full`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text-dark font-ma-shan">{title}</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="mb-6">
          {children}
        </div>
        
        {footer && (
          <div className="flex justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default SimpleModal;

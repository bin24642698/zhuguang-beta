'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ErrorModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ show, message, onClose }) => {
  // 防止滚动
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  // 如果不显示，则不渲染任何内容
  if (!show) return null;

  // 使用Portal将错误提示渲染到DOM的根级别
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-fadeIn">
        <div className="flex items-center mb-4">
          <span className="material-icons text-red-500 mr-2">error</span>
          <h3 className="text-lg font-medium text-text-dark">输入错误</h3>
        </div>
        <p className="text-text-medium mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-[#6F9CE0] text-white rounded-lg hover:bg-[#5A8BD0] transition-colors"
            onClick={onClose}
          >
            确定
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ErrorModal;

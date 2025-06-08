'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RechargeModal: React.FC<RechargeModalProps> = ({ isOpen, onClose }) => {
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

  const handleOptionClick = (option: string) => {
    console.log(`选择了: ${option}`);
    // 此处可以添加未来的充值逻辑
    // onClose(); // 可以选择点击选项后关闭模态窗口
  };

  // 如果模态窗口未打开或组件未挂载，不渲染任何内容
  if (!isOpen || !isMounted) return null;

  // 使用createPortal将模态窗口渲染到body
  return createPortal(
    // 外部容器 (背景遮罩)
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      {/* 内部容器 (居中面板) */}
      <div
        className="bg-white shadow-xl rounded-xl w-full max-w-md" // 使用 rounded-xl 或 rounded-2xl 适配图片
        onClick={(e) => e.stopPropagation()} // 防止点击面板内部关闭
      >
        {/* 面板头部 */}
        <div className="flex justify-between items-center py-3 px-5 border-b border-slate-200">
          {/* 占位符，使标题居中 */}
          <div className="w-6 h-6"></div>
          <h3 className="text-md font-semibold text-slate-700">会员充值</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="关闭"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        </div>

        {/* 充值选项容器 */}
        <div className="space-y-3 p-5">
          {/* 普通会员 */}
          <button
            onClick={() => handleOptionClick('普通会员')}
            className="w-full flex items-center p-3.5 rounded-xl transition-colors duration-150 focus:outline-none bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 focus:ring-2 focus:ring-blue-400"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mr-4 text-white">
              <span className="material-icons text-xl">star</span>
            </div>
            <div>
              <h4 className="font-semibold text-base text-left text-blue-700">普通会员</h4>
              <p className="text-sm text-left text-slate-500">专享特权，畅享阅读。</p>
            </div>
          </button>

          {/* 高级会员 */}
          <button
            onClick={() => handleOptionClick('高级会员')}
            className="w-full flex items-center p-3.5 rounded-xl transition-colors duration-150 focus:outline-none bg-yellow-50 hover:bg-yellow-100 border border-transparent hover:border-yellow-200 focus:ring-2 focus:ring-yellow-400"
          >
            <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center mr-4 text-white">
              <span className="material-icons text-xl">auto_awesome</span>
            </div>
            <div>
              <h4 className="font-semibold text-base text-left text-yellow-700">高级会员</h4>
              <p className="text-sm text-left text-yellow-600">尊贵身份，更多精彩。</p>
            </div>
          </button>

          {/* 黑金会员 */}
          <button
            onClick={() => handleOptionClick('黑金会员')}
            className="w-full flex items-center p-3.5 rounded-xl transition-colors duration-150 focus:outline-none bg-slate-800 hover:bg-slate-700 text-white border border-transparent hover:border-slate-600 focus:ring-2 focus:ring-yellow-400"
          >
            <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center mr-4 text-slate-800">
              <span className="material-icons text-xl">workspace_premium</span>
            </div>
            <div>
              <h4 className="font-semibold text-base text-left text-yellow-300">黑金会员</h4>
              <p className="text-sm text-left text-slate-300">至尊体验，无限可能。</p>
            </div>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RechargeModal;
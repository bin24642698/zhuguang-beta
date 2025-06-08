import React from 'react';

interface EmptyArchiveStateProps {
  selectedWorkId: number | null;
  selectedCategory: string | null;
  onCreateArchive: () => void;
}

const EmptyArchiveState: React.FC<EmptyArchiveStateProps> = ({
  selectedWorkId,
  selectedCategory,
  onCreateArchive
}) => {
  return (
    <div className="flex-1 flex items-center justify-center flex-col p-8 bg-white">
      <div className="w-24 h-24 bg-[rgba(125,133,204,0.1)] rounded-full flex items-center justify-center mb-6">
        <span className="material-icons text-5xl text-[rgba(125,133,204,0.7)]">description</span>
      </div>
      <h3 className="text-xl font-medium text-text-dark mb-3 font-ma-shan">开始创作之旅</h3>
      <p className="text-text-medium mb-8 text-center max-w-md">
        选择或创建一个档案，记录你的创作灵感、角色设定和世界观
      </p>
      <button
        className={`px-5 py-2.5 ${
          selectedWorkId === null || selectedCategory === null
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#7D85CC] text-white hover:bg-[#6b73b3]'
        } rounded-full flex items-center text-sm shadow-md transition-all duration-200`}
        onClick={onCreateArchive}
        disabled={selectedWorkId === null || selectedCategory === null}
      >
        <span className="material-icons text-sm mr-2">add</span>
        新建档案
      </button>

    </div>
  );
};

export default EmptyArchiveState;

import React from 'react';

interface ArchiveActionButtonsProps {
  selectedWorkId: number | null;
  selectedCategory: string | null;
  onCreateArchive: () => void;
}

const ArchiveActionButtons: React.FC<ArchiveActionButtonsProps> = ({
  selectedWorkId,
  selectedCategory,
  onCreateArchive
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <button
        className={`px-4 py-2 rounded-full flex items-center shadow-sm ${
          selectedWorkId === null || selectedCategory === null
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary-green text-white hover:bg-[#4a8d5b] transition-colors duration-200'
        }`}
        onClick={onCreateArchive}
        disabled={selectedWorkId === null || selectedCategory === null}
      >
        <span className="material-icons text-sm mr-1">add</span>
        新建档案
      </button>

      <div className="flex space-x-1">
        <button className="p-2 rounded-full hover:bg-[rgba(90,157,107,0.1)]">
          <span className="material-icons text-primary-green text-sm">sort</span>
        </button>
        <button className="p-2 rounded-full hover:bg-[rgba(90,157,107,0.1)]">
          <span className="material-icons text-primary-green text-sm">filter_list</span>
        </button>
      </div>
    </div>
  );
};

export default ArchiveActionButtons;

/**
 * 提示词类型卡片组件
 */
import React from 'react';
import { Card } from '@/components/common';

interface PromptTypeInfo {
  label: string;
  color: string;
  icon: string;
  group: string;
  gradient: string;
}

interface PromptTypeCardProps {
  type: string;
  typeInfo: PromptTypeInfo;
  count: number;
  onClick: () => void;
}

/**
 * 提示词类型卡片组件
 * @param props 提示词类型卡片属性
 * @returns 提示词类型卡片组件
 */
export const PromptTypeCard: React.FC<PromptTypeCardProps> = ({
  type,
  typeInfo,
  count,
  onClick
}) => {
  // 提取颜色代码用于边框
  const borderColor = typeInfo.color.split(' ')[1].replace('text-', 'rgba(').replace(/\]/, ', 0.4)');

  // 提示词类型描述
  const getTypeDescription = (type: string): string => {
    switch (type) {
      case 'ai_writing':
        return '用于AI辅助创作小说内容，生成高质量文学作品的提示词';
      case 'ai_polishing':
        return '用于AI润色和优化已有文本，提升文学性和可读性的提示词';
      case 'ai_analysis':
        return '用于AI分析文学作品的结构、人物、情节和主题的提示词';
      case 'worldbuilding':
        return '用于设计和描述故事世界设定的提示词';
      case 'character':
        return '用于塑造和深化角色形象的提示词';
      case 'plot':
        return '用于构思和完善故事情节的提示词';
      case 'introduction':
        return '用于创作引人入胜的开篇导语的提示词';
      case 'outline':
        return '用于规划故事主线和章节的提示词';
      case 'detailed_outline':
        return '用于设计细节丰富的章节内容的提示词';
      case 'book_tool':
        return '一键上传TXT文件，AI智能分析文本内容，快速提取关键信息和创作灵感';
      default:
        return '提示词模板';
    }
  };

  return (
    <Card
      className="h-80 cursor-pointer hover:shadow-md transition-all duration-300 animate-fadeIn"
      onClick={onClick}
      tapeColor={borderColor}
      withTape={false}
      withPageCurl={true}
    >
      <div className="flex flex-col h-full">
        {/* 顶部LOGO和标题在同一行 */}
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 rounded-full ${typeInfo.color.split(' ')[0]} flex items-center justify-center mr-3`}>
            <span className={`material-icons text-xl ${typeInfo.color.split(' ')[1]}`}>{typeInfo.icon}</span>
          </div>
          <h3 className="font-medium text-text-dark text-xl font-ma-shan">{typeInfo.label}</h3>
        </div>

        <p className="text-text-medium text-sm mb-6">
          {getTypeDescription(type)}
        </p>

        <div className="mt-auto text-sm text-text-medium">
          {count} 个提示词
        </div>
      </div>
    </Card>
  );
};

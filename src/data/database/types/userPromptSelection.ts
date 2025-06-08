/**
 * 用户提示词选择类型定义
 */

// 用户提示词选择类型
export interface UserPromptSelection {
  id?: string; // 统一使用字符串ID
  userId: string;
  promptId: string; // 统一使用字符串ID
  createdAt: Date;
}

/**
 * ID工具函数
 */

/**
 * 确保ID是字符串类型
 * @param id 任意类型的ID
 * @returns 字符串ID
 */
export const ensureStringId = (id: any): string => {
  if (id === null || id === undefined) return '';
  return String(id);
};

/**
 * 比较两个ID是否相等（忽略类型差异）
 * @param id1 第一个ID
 * @param id2 第二个ID
 * @returns 是否相等
 */
export const areIdsEqual = (id1: any, id2: any): boolean => {
  return String(id1) === String(id2);
};

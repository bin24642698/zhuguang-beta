/**
 * 验证工具函数
 */

/**
 * 验证标题
 * @param title 标题
 * @returns 错误信息或null
 */
export const validateTitle = (title: string): string | null => {
  if (!title.trim()) {
    return '标题不能为空';
  }

  if (title.length > 100) {
    return '标题不能超过100个字符';
  }

  return null;
};

/**
 * 验证内容
 * @param content 内容
 * @returns 错误信息或null
 */
export const validateContent = (content: string): string | null => {
  if (!content.trim()) {
    return '内容不能为空';
  }

  return null;
};

/**
 * 验证描述
 * @param description 描述
 * @returns 错误信息或null
 */
export const validateDescription = (description: string): string | null => {
  if (description.length > 500) {
    return '描述不能超过500个字符';
  }

  return null;
};

/**
 * 验证API密钥
 * @param apiKey API密钥
 * @returns 错误信息或null
 */
export const validateApiKey = (apiKey: string): string | null => {
  if (!apiKey.trim()) {
    return 'API密钥不能为空';
  }

  // 简单验证API密钥格式
  if (!/^[a-zA-Z0-9_-]{10,}$/.test(apiKey)) {
    return 'API密钥格式不正确';
  }

  return null;
};

/**
 * 验证邮箱格式和域名
 * @param email 邮箱
 * @returns 错误信息或null
 */
export const validateEmailDomain = (email: string): string | null => {
  if (!email.trim()) {
    return '邮箱不能为空';
  }

  // 基本邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '邮箱格式不正确';
  }

  // 域名验证
  const allowedDomains = ['qq.com', '163.com', 'gmail.com'];
  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (!emailDomain || !allowedDomains.includes(emailDomain)) {
    return '只支持 @qq.com、@163.com 和 @gmail.com 邮箱注册';
  }

  return null;
};

# 烛光写作 Supabase 集成

本目录包含烛光写作应用与 Supabase 集成的相关代码。

## 配置

在 `.env.local` 文件中配置以下环境变量：

```
# 功能开关
NEXT_PUBLIC_USE_SUPABASE_PROMPTS=true
```

### 使用方法

1. **启用功能**：
   - 设置 `NEXT_PUBLIC_USE_SUPABASE_PROMPTS=true`
   - 确保用户已登录（使用 Supabase 认证）

2. **添加提示词**：
   - 提示词内容直接存储在 Supabase 数据库中

3. **查看提示词**：
   - 提示词卡片显示标题、描述和内容
   - 用户可以查看完整的提示词内容

4. **使用提示词**：
   - 在 AI 写作等功能中直接使用提示词内容

## 相关文件

- `promptService.ts`: Supabase 提示词服务
- `../../scripts/supabase-prompts-schema.sql`: Supabase 提示词表结构

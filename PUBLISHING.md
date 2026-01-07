# 发布指南 (Publishing Guide)

本文档描述了如何发布 Vite Enhance Kit 到 npm 注册表。

## 前置条件

1. **npm 账户**: 确保您有 npm 账户并已登录
   ```bash
   npm login
   ```

2. **权限**: 确保您有发布权限（对于组织包需要相应权限）

3. **Git 状态**: 确保工作目录干净，在 main 分支上

## 发布流程

### 方法 1: 使用自动化脚本 (推荐)

我们提供了自动化的发布脚本来简化整个流程：

```bash
# 干运行 - 检查所有步骤但不实际发布
pnpm release:dry-run

# 正式发布
pnpm release
```

自动化脚本会执行以下步骤：
1. ✅ 检查 Git 状态和分支
2. ✅ 运行测试和类型检查
3. ✅ 构建所有包
4. ✅ 创建/更新 changesets
5. ✅ 版本管理
6. ✅ 发布到 npm
7. ✅ 推送到 Git 并创建标签

### 方法 2: 手动步骤

如果您想手动控制每个步骤：

#### 1. 预发布检查

```bash
# 检查包的完整性
node scripts/pre-publish-check.js

# 构建所有包
pnpm build

# 运行测试
pnpm typecheck
```

#### 2. 创建 Changeset

```bash
# 创建新的 changeset (描述更改)
pnpm changeset

# 查看当前 changeset 状态
pnpm changeset:status
```

#### 3. 版本管理

```bash
# 更新版本号
pnpm changeset:version

# 提交版本更改
git add .
git commit -m "chore: version packages"
```

#### 4. 发布

```bash
# 构建并发布
pnpm build
# changeset publish 会在发布前自动运行 prepublishOnly 脚本，
# 该脚本会将 catalog: 协议替换为实际版本号
pnpm changeset:publish

# 推送更改和标签
git push
git push --tags
```

## Changeset 工作流

### 创建 Changeset

当您做出需要发布的更改时：

```bash
pnpm changeset
```

系统会询问：
1. 哪些包受到影响
2. 更改类型（patch/minor/major）
3. 更改描述

### Changeset 类型

- **patch** (0.0.X): 错误修复，向后兼容
- **minor** (0.X.0): 新功能，向后兼容
- **major** (X.0.0): 破坏性更改

### 示例 Changeset

```markdown
---
"vite-enhance": minor
"@vite-enhance/config": patch
---

添加新的 CDN 插件支持，修复配置验证问题
```

## 包发布策略

### 版本同步

我们使用 "fixed" 版本策略，主要包保持版本同步：
- `vite-enhance`
- `@vite-enhance/config`
- `@vite-enhance/shared`

### 发布顺序

Changesets 会自动处理依赖顺序：
1. `@vite-enhance/shared` (基础包)
2. `@vite-enhance/config` (依赖 shared)
3. `vite-enhance` (主包，依赖 config 和 shared)
4. 插件包 (可独立版本)

## 发布检查清单

发布前请确认：

- [ ] 所有测试通过
- [ ] 构建成功
- [ ] 版本号正确
- [ ] CHANGELOG 已更新
- [ ] Git 状态干净
- [ ] 在 main 分支
- [ ] 已创建适当的 changeset
- [ ] 文档已更新

## 故障排除

### 常见问题

1. **构建失败**
   ```bash
   pnpm clean
   pnpm install
   pnpm build
   ```

2. **版本冲突**
   ```bash
   # 检查版本一致性
   pnpm version:check
   ```

3. **发布权限问题**
   ```bash
   # 检查登录状态
   npm whoami
   
   # 重新登录
   npm login
   ```

4. **Git 状态不干净**
   ```bash
   # 查看状态
   git status
   
   # 提交或储藏更改
   git add .
   git commit -m "fix: prepare for release"
   ```

### 回滚发布

如果需要回滚已发布的版本：

```bash
# 撤销特定版本 (24小时内)
npm unpublish package-name@version

# 或者发布修复版本
pnpm changeset
# 选择 patch 版本，描述修复内容
pnpm release
```

## 发布后步骤

1. **验证发布**
   - 检查 npm 注册表: https://www.npmjs.com/package/vite-enhance
   - 测试安装: `npm install vite-enhance@latest`

2. **创建 GitHub Release**
   - 从新标签创建 GitHub release
   - 添加发布说明

3. **更新文档**
   - 更新 README 中的版本信息
   - 更新示例代码

4. **通知团队**
   - 发送发布通知
   - 更新内部文档

## 自动化 CI/CD

考虑设置 GitHub Actions 来自动化发布流程：

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: pnpm changeset:publish
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 联系方式

如果在发布过程中遇到问题，请：
1. 查看此文档的故障排除部分
2. 检查 GitHub Issues
3. 联系维护团队
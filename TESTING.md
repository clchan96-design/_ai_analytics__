# 測試指南

本項目已配置完整的測試框架，包括前端和後端測試。

## 快速開始

### 運行所有測試（監視模式）
```bash
npm run test
```

### 運行測試一次（CI 模式）
```bash
npm run test:run
```

### 使用 UI 介面查看測試
```bash
npm run test:ui
```

### 生成覆蓋率報告
```bash
npm run test:coverage
```

## 測試結構

### 前端測試
- 位置：`src/test/App.test.tsx`
- 框架：Vitest + React Testing Library
- 測試內容：
  - 組件渲染
  - 用戶交互
  - 表單驗證
  - UI 狀態管理

### 後端測試  
- 位置：`src/test/api.test.ts`
- 框架：Vitest
- 測試內容：
  - API 參數驗證
  - 環境變數檢查
  - 請求驗證邏輯

## 編寫測試

### 前端組件測試範例
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('應該正確渲染', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('應該處理點擊事件', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### 後端邏輯測試範例
```typescript
import { describe, it, expect } from 'vitest';

describe('validation', () => {
  it('應該驗證輸入', () => {
    const result = validateInput('test');
    expect(result).toBe(true);
  });
});
```

## 相關配置文件

- `vitest.config.ts` - Vitest 主配置
- `src/test/setup.ts` - 測試環境設置

## 常用命令

| 命令 | 說明 |
|------|------|
| `npm run test` | 以監視模式運行所有測試 |
| `npm run test:run` | 運行所有測試一次 |
| `npm run test:ui` | 打開測試 UI 介面 |
| `npm run test:coverage` | 生成覆蓋率報告 |
| `npm run lint` | 運行 TypeScript 類型檢查 |

## 最佳實踐

1. **命名慣例** - 測試文件應以 `.test.ts` 或 `.test.tsx` 結尾
2. **描述性名稱** - 使用清晰的 `describe` 和 `it` 文本
3. **單一職責** - 每個測試應只測試一個功能
4. **完整設置** - 使用 `beforeEach` 和 `afterEach` 管理測試狀態
5. **避免測試實現** - 專注於測試行為而非內部實現

## 故障排除

### 測試無法找到模組
確保 `vitest.config.ts` 中的路徑別名配置正確。

### React 測試失敗
檢查 `src/test/setup.ts` 是否正確配置 jsdom 環境。

### 環境變數未定義
在 `.env` 文件中設置必要的環境變數，或在測試中使用 `vi.mock()`。

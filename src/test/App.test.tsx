import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn();
    // Mock navigator.clipboard
    navigator.clipboard.readText = vi.fn();
  });

  it('應該正確渲染應用程式', () => {
    render(<App />);
    
    // 檢查主標題是否存在
    expect(screen.getByText(/會議原稿/i)).toBeInTheDocument();
  });

  it('應該能輸入會議內容', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const textarea = screen.getByPlaceholderText(/在此貼上您錄下的會議逐字稿/i);
    await user.type(textarea, '測試會議內容');
    
    expect(textarea).toHaveValue('測試會議內容');
  });

  it('清空按鈕應該正確運作', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const textarea = screen.getByPlaceholderText(/在此貼上您錄下的會議逐字稿/i);
    await user.type(textarea, '測試內容');
    
    const clearButton = screen.getByTitle('清除內容');
    
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    await user.click(clearButton);
    
    expect(textarea).toHaveValue('');
  });

  it('應該显示語言選項', () => {
    render(<App />);
    
    const languageSelect = screen.getByRole('combobox', { name: /目標報告語系/i });
    expect(languageSelect).toBeInTheDocument();
  });

  it('生成按鈕在沒有內容時應該被禁用', () => {
    render(<App />);
    
    const generateButton = screen.getByRole('button', { name: /開始生成會議紀錄/i });
    expect(generateButton).toBeDisabled();
  });

  it('應該顯示測試樣本', () => {
    render(<App />);
    
    // 檢查是否有示例按鈕
    expect(screen.getByText(/快選以下真實商務模擬範本體驗效果/i)).toBeInTheDocument();
  });
});

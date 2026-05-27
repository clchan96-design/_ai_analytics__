import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Trash2,
  Globe,
  FileDown,
  Clock,
  ListChecks,
  Info,
  CornerDownRight,
  RefreshCw,
  Zap,
  HelpCircle,
  FileSpreadsheet,
  Workflow,
  ClipboardPaste
} from "lucide-react";
import Markdown from "react-markdown";
import { MEETING_SAMPLES, MeetingSample } from "./data/samples";

export default function App() {
  const [content, setContent] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("zh-TW");
  const [style, setStyle] = useState("detailed");
  const [extraInstructions, setExtraInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  // 載入趣味十足的後台處理幽默語句
  const loadingSteps = [
    "🔍 正在解析發言人角色，釐清對話發言關係...",
    "✂️ 正在進行語義降噪，過濾重複贅詞、發言空話...",
    "🧠 進階多層次分析：提取會議的核心意圖、議論爭點與共識...",
    "💡 提煉決策本質：歸納拍板定案的關鍵結論...",
    "🚀 自動生成 Action Items 清單：釐清【任務、負責人、截止日】...",
    "🗣️ 正在呼叫跨語言商務翻譯引導，打磨地道商業用詞...",
    "✍️ 正在進行 Markdown 手工質感格式排版，雕琢視覺可讀性..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 4000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      const startTime = Date.now();
      timer = setInterval(() => {
        setElapsedTime(parseFloat(((Date.now() - startTime) / 1000).toFixed(1)));
      }, 100);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
        setActiveSampleId(null);
      }
    } catch (err) {
      console.error("無法讀取剪貼簿權限，請手動 command + v 貼上", err);
    }
  };

  const loadSample = (sample: MeetingSample) => {
    setContent(sample.content);
    setTargetLanguage(sample.defaultLanguage);
    setStyle(sample.defaultStyle);
    setActiveSampleId(sample.id);
  };

  const handleClear = () => {
    if (window.confirm("確定要清空目前的會議內容與配置嗎？")) {
      setContent("");
      setExtraInstructions("");
      setActiveSampleId(null);
    }
  };

  const handleGenerate = async () => {
    if (!content.trim()) {
      alert("請先輸入或貼上會議原始內容/逐字稿喔！");
      return;
    }

    setLoading(true);
    setResult("");
    setDownloaded(false);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content,
          targetLanguage,
          style,
          extraInstructions
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成失敗，未知錯誤。");
      }

      setResult(data.result);
    } catch (err: any) {
      console.error("Generate API Error:", err);
      alert(`發生錯誤：${err.message || "請檢查網路連線或 API 金鑰"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    // 試著從 Markdown 檔中推斷標題
    let title = "智慧會議記錄";
    const headerMatch = result.match(/^#\s+(.+)$/m);
    if (headerMatch && headerMatch[1]) {
      title = headerMatch[1].trim().replace(/[\\/:*?"<>|]/g, "");
    }

    const blob = new Blob([result], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col justify-between">
      {/* 頂部 Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
                AI 會議記錄生成與翻譯工具
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                智慧重整冗長逐字稿 • 一鍵生成商務紀要、決議與待辦清單
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Zap className="w-3.5 h-3.5 mr-1" />
              Gemini 3.5 Turbo 核心
            </span>
          </div>
        </div>
      </header>

      {/* 主體區 block */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 左側輸入控制板片 (Column 5) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* 輸入編輯器 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 id="input-section-title" className="font-bold text-slate-900 text-base">會議原稿 / 逐字稿輸入</h2>
              </div>
              <div className="flex space-x-1.5">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  title="從剪貼簿貼上"
                >
                  <ClipboardPaste className="w-3.5 h-3.5 mr-1" />
                  貼上
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={!content}
                  className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 transition-colors"
                  title="清除內容"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  清空
                </button>
              </div>
            </div>

            {/* 輸入 Textarea */}
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setActiveSampleId(null);
                }}
                placeholder="在此貼上您錄下的會議逐字稿、混雜對話、簡要重點或手寫草稿。
例如：
「陳總說明天要提報案子，王經理表示可以但行銷圖下山才能出，小華這週五要想辦法先出暫定切版...」"
                className="w-full h-80 min-h-[240px] pr-2 py-3 px-4 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-sans text-sm leading-relaxed resize-none scrollbar-thin"
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-slate-100/90 py-0.5 px-2 rounded-md font-mono">
                {content.length.toLocaleString()} 字
              </div>
            </div>

            {/* 快速載入體驗範本 */}
            <div className="bg-indigo-50/50 rounded-xl p-3.5 border border-indigo-100/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-950 mb-2.5">
                <Workflow className="w-3.5 h-3.5 text-indigo-600" />
                沒有文稿？快選以下真實商務模擬範本體驗效果：
              </div>
              <div className="grid grid-cols-1 gap-2">
                {MEETING_SAMPLES.map((sample) => {
                  const isActive = activeSampleId === sample.id;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => loadSample(sample)}
                      className={`text-left p-2.5 rounded-lg text-xs transition-all border ${
                        isActive
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white hover:bg-indigo-50 text-slate-700 border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{sample.title}</span>
                        {isActive && (
                          <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.2 rounded-md font-mono">
                            已載入
                          </span>
                        )}
                      </div>
                      <p className={`line-clamp-1 mt-1 text-[11px] ${isActive ? "text-indigo-100" : "text-slate-500"}`}>
                        {sample.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI 配置參數 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h2 id="ai-settings-title" className="font-bold text-slate-900 text-base">自動總結與翻譯配置</h2>
            </div>

            {/* 語言與翻譯選擇 */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="targetLanguage" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                🗣️ 目標報告語系
              </label>
              <select
                id="targetLanguage"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
              >
                <option value="zh-TW">繁體中文版 (預設 • 專業紀錄)</option>
                <option value="bilingual-en">雙語對照版 (繁中 + English • 跨國合作首選)</option>
                <option value="en">英文版 (Full English Report • 呈報海外高層)</option>
                <option value="ja">日文版 (ビジネス日本語版 • 適合日商常規)</option>
                <option value="ko">韓文版 (한국어 보고서 • 韓商標準)</option>
              </select>
            </div>

            {/* 輸出記錄風格 */}
            <div className="flex flex-col space-y-2.5">
              <label htmlFor="style" className="text-xs font-semibold text-slate-700">
                📝 生成報告風格
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "detailed", label: "深度紀實版", desc: "保留脈絡討論" },
                  { id: "concise", label: "精幹大綱版", desc: "10秒看懂結論" },
                  { id: "slack", label: "社群群組版", desc: "利於通訊轉傳" }
                ].map((item) => {
                  const isSelected = style === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStyle(item.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col justify-between h-20 shadow-sm ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/10 text-indigo-950"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[10px] text-slate-400 mt-1 line-clamp-1 block">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 額外特殊要求 */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="extraInstructions" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  💡 額外備註與補充交代
                </label>
                <span className="text-[10px] text-slate-400 font-medium">選填</span>
              </div>
              <input
                id="extraInstructions"
                type="text"
                value={extraInstructions}
                onChange={(e) => setExtraInstructions(e.target.value)}
                placeholder="例如：請著重李小華說的話、列出詳細定價、將待辦加倍強調"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all leading-normal"
              />
            </div>

            {/* 主提交生成按鈕 */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !content.trim()}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                loading
                  ? "bg-slate-400 cursor-not-allowed shadow-none"
                  : !content.trim()
                  ? "bg-indigo-300/80 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-98"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>AI 正在強力整理與翻譯中... ({elapsedTime}秒)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>🚀 開始生成會議紀錄。</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 右側結果與預覽板片 (Column 7) */}
        <div className="lg:col-span-7 flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-grow flex flex-col h-full overflow-hidden">
            
            {/* 結果欄 header */}
            <div className="border-b border-rose-50/10 bg-slate-50/60 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900 text-sm">AI 會議智能生成結果預覽</span>
              </div>

              {/* 在生成完畢後提供多個操作選項 */}
              {result && (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all border border-indigo-200 cursor-pointer shadow-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        <span className="text-emerald-700">已複製</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span>複製 Markdown</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all border border-emerald-200 cursor-pointer shadow-xs"
                  >
                    {downloaded ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        <span>已下載</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-3.5 h-3.5 mr-1" />
                        <span>匯出 .md 檔案</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 結果版面主體 */}
            <div className="flex-grow overflow-y-auto bg-white p-6 relative flex flex-col scrollbar-thin">
              <AnimatePresence mode="wait">
                
                {/* 1. 未生成或初始狀態 */}
                {!loading && !result && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="flex-grow flex flex-col items-center justify-center text-center p-8 m-auto max-w-sm"
                  >
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4 border border-slate-200/60">
                      <ListChecks className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1.5">尚未生成任何會議紀錄</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      請在左側貼上會議逐字稿口語對話，配置好理想的輸出報告語言與風格，點擊「開始生成」按鈕。
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                      <Info className="w-3.5 h-3.5" />
                      支持智慧代辦、中英雙語對照
                    </div>
                  </motion.div>
                )}

                {/* 2. 進行中載入動畫 */}
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="flex-grow flex flex-col items-center justify-center text-center p-8 m-auto max-w-md w-full"
                  >
                    <div className="relative mb-6">
                      <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50/80 px-4 py-3 rounded-2xl border border-indigo-100/50 w-full mb-4">
                      <h4 className="font-bold text-indigo-950 text-sm mb-1.5">正在拼命為您梳理紀錄</h4>
                      
                      {/* 進度文字流 - 隨著時間切換其狀態，模擬複雜的後台動作 */}
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={loadingStep}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-xs text-indigo-700 font-medium h-5 line-clamp-1"
                        >
                          {loadingSteps[loadingStep]}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span>已花費 {elapsedTime} 秒</span>
                    </div>
                  </motion.div>
                )}

                {/* 3. 完美 Markdown 生成結果渲染 */}
                {!loading && result && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose max-w-none text-slate-800 break-words flex flex-col flex-grow select-text"
                  >
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 mb-6 flex items-center justify-between text-xs text-slate-500 font-medium shrink-0">
                      <span className="flex items-center gap-1 sm:gap-2">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        AI 生成用時: <strong className="text-slate-800">{elapsedTime} 秒</strong>
                      </span>
                      <span className="w-px h-3 bg-slate-300" />
                      <span>
                        總計字數: <strong className="text-slate-800">{result.length} 字</strong>
                      </span>
                    </div>

                    {/* 自製高品格 Markdown 渲染對應 */}
                    <div className="text-sm leading-relaxed p-4 bg-white rounded-xl border border-slate-100 shadow-2xl shadow-indigo-100/20 select-text markdown-container">
                      <Markdown
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1
                              id={props.id}
                              className="text-xl md:text-2xl font-bold text-slate-950 border-b-2 border-indigo-600/20 pb-2 mb-4 mt-8 flex items-center gap-2 first:mt-0 tracking-tight"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              id={props.id}
                              className="text-base md:text-lg font-bold text-slate-900 border-b border-indigo-100 pb-1.5 mb-3 mt-6 flex items-center gap-1.5 tracking-tight"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              id={props.id}
                              className="text-sm md:text-base font-semibold text-indigo-950 mb-2 mt-4 flex items-center"
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => <p className="text-slate-700 leading-relaxed mb-4" {...props} />,
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-5 space-y-1.5 mb-4 text-slate-700" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal pl-5 space-y-1.5 mb-4 text-slate-700" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="pl-0 text-slate-700 text-sm leading-relaxed" {...props} />
                          ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="border-l-4 border-indigo-500 bg-indigo-50/50 px-4 py-3 my-4 rounded-r-xl text-indigo-950 italic text-sm"
                              {...props}
                            />
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              className="bg-slate-100 text-indigo-600 rounded px-1.5 py-0.5 text-xs font-mono border border-slate-200/50"
                              {...props}
                            />
                          ),
                          hr: ({ node, ...props }) => <hr className="my-6 border-slate-200" {...props} />,
                          input: ({ node, ...props }) => {
                            if (props.type === "checkbox") {
                              return (
                                <input
                                  type="checkbox"
                                  className="w-4.5 h-4.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 mr-2.5 mt-0.5 accent-indigo-600 inline-block align-top pointer-events-none"
                                  checked={props.checked}
                                  readOnly
                                  {...props}
                                />
                              );
                            }
                            return <input {...props} />;
                          }
                        }}
                      >
                        {result}
                      </Markdown>
                    </div>

                    <div className="mt-8 text-center text-xs text-slate-400 font-medium">
                      ✨ 會議紀錄生成完畢，您可以使用上方操作欄「複製 Markdown」或「匯出 .md 檔案」。
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* 底部 Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 shrink-0 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5 mb-2 md:mb-0">
            <span>© 2026 AI 公司會議智能秘書大師。</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              100% 安全：隱私原創逐字稿與密鑰均在伺服器端守護
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

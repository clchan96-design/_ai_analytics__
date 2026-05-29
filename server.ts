import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// 解析 JSON 請求體，並適度調大限制，以符合大型會議逐字稿的字數需求
app.use(express.json({ limit: '20mb' }));

// 初始化 Gemini AI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
});

// 定義系統指令，設定 AI 行為＆輸出格式
const SYSTEM_INSTRUCTIONS = `你是一位專業的會議記錄助理。請根據使用者提供的會議逐字稿，整理出結構化的會議紀錄。
請務必遵守以下輸出格式要求：

1. **會議主題與時間**：擷取會議的主題與時間。
2. **與會者**：列出參與會議的人員。
3. **會議重點總結**：用 3 到 5 個重點總結會議內容。
4. **Action Items (待辦事項)**：明確列出接下來的待辦事項與負責人。
5. **英文翻譯版**：將上述 1~4 點的內容完整翻譯成專業的英文。

請以 Markdown 格式輸出，所有繁體中文部分必須使用**繁體中文**回覆，不要包含任何額外的問候語或結語。`;

// 建立生成會議記錄與翻譯 API 端點
app.post("/api/summarize", async (req, res) => {
  try {
    const { content, targetLanguage, style, extraInstructions } = req.body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: "請貼上會議記錄或逐字稿內容，內容不可為空。" });
    }

    let languagePrompt = "";
    if (targetLanguage === "zh-TW") {
      languagePrompt = "請確實遵守原系統指南的所有規範，第 1~4 部分用繁體中文，第 5 部分用專業英文。";
    } else if (targetLanguage === "en") {
      languagePrompt = "因應使用者特殊選取，請將整份會議紀錄的第 1~5 部分全部轉換並輸出為【全英文版本】，請以英文取代繁體中文部分。";
    } else if (targetLanguage === "ja") {
      languagePrompt = "因應使用者特殊選取，請特別將第 1~4 點的內容也翻譯一份「專業日文版本（日本語版）」附加在英文翻譯版（第 5 部分）的後方，便於對日交流。";
    } else if (targetLanguage === "ko") {
      languagePrompt = "因應使用者特殊選取，請特別將第 1~4 點的內容也翻譯一份「專業韓文版本」附加在英文翻譯版（第 5 部分）的後方，便於對韓交流。";
    } else if (targetLanguage === "bilingual-en") {
      languagePrompt = "請格外強調中英對照的流暢度與專業商務遣詞。";
    }

    let stylePrompt = "";
    if (style === "concise") {
      stylePrompt = "【極簡大綱版要求】：這份紀錄請著重最精幹關鍵決策，略去討論贅詞、廢話。";
    } else if (style === "slack") {
      stylePrompt = "【社群群組版要求】：請多採用精美 Emoji 開頭圖示作為項目小標徽章，文字段落便於快速複製轉寄。";
    } else {
      stylePrompt = "【深度完整紀實要求】：請完整、詳盡地提煉討論脈絡與決策，不要遺漏發言細節。";
    }

    let userPrompt = `
這是使用者提供的會議原始內容與逐字稿：
------------------------------------
${content}
------------------------------------

【處理參數與特別要求】：
1. 語言加強要求：${languagePrompt}
2. 風格偏好要求：${stylePrompt}
${extraInstructions ? `3. 額外特別補充要求：${extraInstructions}` : ""}

請開始根據上述指定的格式與要求，為我產出結構化的 Markdown 會議紀錄成果。`;

    // 呼叫 Gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.2, // 保持較低溫度以獲取更穩定、結構化的產出
      },
    });

    if (!response || !response.text) {
      throw new Error("模型產出異常，未獲得文字內容。");
    }

    return res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error generating meeting notes via Gemini:", error);
    return res.status(500).json({
      error: error.message || "AI 服務暫時無法回應，請檢查 API Key 設置或稍後再試。"
    });
  }
});

// 接上 Vite 及靜態文件服務
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Core backend is booting on http://localhost:${PORT}`);
  });
};

startServer();

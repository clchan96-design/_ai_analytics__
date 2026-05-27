export interface MeetingSample {
  id: string;
  title: string;
  description: string;
  content: string;
  defaultLanguage: string;
  defaultStyle: string;
}

export const MEETING_SAMPLES: MeetingSample[] = [
  {
    id: "marketing-collab",
    title: "1. 跨部門改版需求吵架會 (口語混亂)",
    description: "具有爭執、發散、各種贅詞與打岔的典型對話，用來考驗 AI 梳理邏輯與行動清單的能力。",
    defaultLanguage: "zh-TW",
    defaultStyle: "detailed",
    content: `陳美玲（PM）：大家午安，那我們今天主要是要對一下二季度首頁購物車優化的進度。上次美工那邊說設計圖因為主視覺延遲，下週二才能出，這會有影響嗎？
李小華（前端）：沒差，不對，等一下，這很有差吧！你下週二才給我首頁設計圖，我切版還要兩天，那下週五又要上線，我不用睡覺喔？而且那個購物車的 API，後端那邊不是還沒給？
王大明（市場行銷）：美玲啊，我是覺得首頁那個購物車，首頁 banner 下面那格一定要放我們最新一期的促銷券。對，就是那個「限時 8 折神券」。如果你不放的話，我們這檔廣告打出去根本沒地方點，行銷預算就放水流了。
李小華（前端）：可是大明，首頁已經有三個輪播，再加一個促銷券區塊，那個載入速度會掉。特別是移動端，現在 Google 的速度分數很重要。
陳美玲（PM）：大明，促銷 banner 首頁已經有預留第二張輪播了，不一定要在購物車下方，因為那裡主要是要引導結帳。小華，那如果我們促銷券區塊不放圖片，改用純文字搭配 CSS 的美化呢？這樣載入應該蠻快的吧？
李小華（前端）：純 CSS 勉強行啦，但後端 API 真的要快點給，那個 Json schema 下週一一定要先訂出來。
王大明（市場行銷）：好啦，CSS 可以啦，只要能看得清、點得進去，用戶可以領就好。但我這週要先拿一張行銷模擬圖去報主管那邊，看能不能在週五下班前先塞個暫定版設計給我？
陳美玲（PM）：好的，大明，這部分我等下兩點找設計師 A-Lin 說一下，請她今天下午先快套一個 mock-up 給你。
李小華（前端）：另外提醒，週五上線我們需要運營那邊在後台先配好測試假數據，不然我沒辦法測試真正的 API 連線。
陳美玲（PM）：好，那我整理一下。今天的結論：
1. A-Lin 今天五點前先提供一張促銷模擬圖（Mockup）給大明，好讓他主管過關。
2. 小華跟後端 A-Lan 下週一中午前要把購物車的 API Json Schema 敲定，避免拖到切版。
3. 設計圖 A-Lin 那邊我會盯她，最遲「下週一」下班前一定要給，不准拖到週二。
4. 運營的假數據，我也去請 Karen 週三前配好。
大家還有什麼意見嗎？
王大明（市場行銷）：沒了沒了，有模擬圖就好。
李小華（前端）：那就下週一前看 API 進度囉。
陳美玲（PM）：OK，謝謝大家，散會！`
  },
  {
    id: "bilingual-sales",
    title: "2. 跨國業務與銷售對話 (中英雙語對照)",
    description: "中英語交融的跨國對話，適合體驗雙語對照與一鍵翻譯成純英文版本的卓越效果。",
    defaultLanguage: "bilingual-en",
    defaultStyle: "detailed",
    content: `林總（General Manager）：Good morning everyoen! 第一期 Sales result 出來了，北美市場有些 lag，但亞太區這邊表現蠻 outstanding。Sarah, could you update us on the North American accounts?
Sarah（Sales Manager）：Yes, 林總。北美那邊主要是 Amazon 的 warehouse 動工延誤造成 logistics 延遲。客戶端這邊有些 complain。I've met with their Director of Purchasing yesterday. 他們表示如果下週三前我們能 ship out the first batch of 500 units, 他們願意維持原合約不扣款。
林總（General Manager）：500 units by next Wednesday? 那生產線那邊頂得住嗎？Kelvin, you are in charge of operations. 工廠那邊的排程 status 怎麼樣？
Kelvin（Operations 主管）：報告林總，目前生產線上的晶片庫存有些 tight，但是如果我們把歐洲那批貨先 leverage 給北美，這 500 台是可以在下週一完成封裝並 coordinate 快遞在下週二出貨的。但是這會造成歐洲那邊有一週的 gap。
Sarah（Sales Manager）：歐洲那邊我有跟經銷商 Marc 聊過，他們那邊目前的 inventory 還夠撐兩到三週（safety stock），所以延遲一週出貨對
Marc 來說是 perfectly acceptable，只要我們多贈送 2% 的 spare parts 作為補償就可以。
林總（General Manager）：OK, that sounds like a viable plan. 那我們就採取這個 trade-off 方案。European stock leverage to NA. Sarah, 你等一下寄封 Email 正式通知 Marc，承諾他 2% spare parts 補償並對 delay 表示歉意。
Sarah（Sales Manager）：No problem, I will send the email right after this meeting and CC you.
Kelvin（Operations 主管）：那我今天下午就請工廠倉庫安排轉運，重新印製北美的進口標籤（shipping labels）。
林總（General Manager）：Great, let's keep a close eye on the shipping process. 我們不能再次承受北美延誤的口碑損失了。Next topic, what is our Q3 promotion budget?`
  },
  {
    id: "tech-standup",
    title: "3. 科技新創團隊 Standup 站會 (極簡大綱)",
    description: "快節奏、多主題的每日站會記錄，適合用來生成極簡通訊軟體回報與一閃即覽的看板。",
    defaultLanguage: "zh-TW",
    defaultStyle: "slack",
    content: `時間：2026-05-26 早上 9:30
與會：Alan, Brenda, Chris, David

Alan（Tech Lead）：
- 昨天：修復了登入頁面在大螢幕下的 CSS 跑版 bug，並把 Docker container 優化了。
- 今天：開始寫 Stripe 支付串接的後端 Webhook。
- 卡點：暫時沒有，但希望 Chris 幫忙 review 一下 DB schema。

Brenda（UI/UX Designer）：
- 昨天：完成 App 2.0 的個人資料、設定介面 High-fi mockup。
- 今天：進行後續的細節切換動畫（Lottie JSON）匯出，並建立 UI 設計規範文檔。
- 卡點：需要跟 David 對一下我們首頁 icon 大小是否符合規範。

Chris（Backend Engineer）：
- 昨天：開發完了使用者註冊的簡訊驗證機制，安全機制測試完成。
- 今天：協助 Alan 審查資料庫設計，下午開始寫交易記錄 API。
- 卡點：簡訊服務商的 API 金鑰好像快過期了，需要請 PM 協助充值。

David（Frontend Engineer）：
- 昨天：把首頁動態饋送元件套完了。
- 今天：把 Brenda 昨天給的新版 Lottie 動畫放到前端跑，並優化頁面渲染效率。
- 卡點：Icon 尺寸確實在某些手機螢幕上有模糊問題，今天下午 3 點會跟 Brenda 開會確認。

Alan：很好，今天下午 3 點 David 和 Brenda 討論 Icon 尺寸問題。Chris 的 DB Schema 審查，我們上午 11 點語音通話 10 分鐘對一下。PM 週五前要給簡訊服務充值。大家加油！`
  }
];

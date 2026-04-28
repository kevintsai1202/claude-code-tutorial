-- =========================================================
-- ShopCart 資料庫初始化腳本
-- 由 Docker entrypoint 在容器首次啟動時執行
-- =========================================================

-- ── 建立資料表 ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  price       INTEGER      NOT NULL,          -- 元（整數，避免浮點誤差）
  category    VARCHAR(20)  NOT NULL,          -- '3C' | '服飾' | '食品'
  image_url   TEXT,
  rating      NUMERIC(3,1)
);

CREATE TABLE IF NOT EXISTS cart (
  id          SERIAL PRIMARY KEY,
  session_id  VARCHAR(36) UNIQUE NOT NULL,    -- UUID，由後端產生
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_item (
  id          SERIAL PRIMARY KEY,
  cart_id     INTEGER REFERENCES cart(id)    ON DELETE CASCADE,
  product_id  INTEGER REFERENCES product(id),
  quantity    INTEGER NOT NULL DEFAULT 1
              CHECK (quantity >= 1 AND quantity <= 99),
  UNIQUE (cart_id, product_id)               -- 同商品不重複新增
);

-- ── Seed 商品資料（30 筆，與前端 mockProducts.ts 對齊） ──

INSERT INTO product (name, description, price, category, image_url, rating) VALUES

-- 3C（10 筆）
('Sony WH-1000XM5 無線降噪耳機',
 '業界頂級主動降噪技術，全新 8 個麥克風設計，連續播放 30 小時，折疊收納輕巧攜帶。',
 9900, '3C', 'https://picsum.photos/seed/tech-01/800/600', 4.8),

('Apple AirPods Pro 第二代',
 '升級 H2 晶片，自適應通透模式，個人化空間音訊，MagSafe 充電盒，防塵防水 IP54。',
 7490, '3C', 'https://picsum.photos/seed/tech-02/800/600', 4.7),

('Logitech MX Master 3S 無線滑鼠',
 '8000 DPI 感光器，靜音按鍵，MagSpeed 電磁滾輪，一鍵切換 3 台裝置，符合人體工學。',
 3590, '3C', 'https://picsum.photos/seed/tech-03/800/600', 4.6),

('Samsung 65吋 QLED 4K 電視',
 'Quantum Matrix 技術，AI 畫質優化，120Hz 更新率，OTS+ 環繞音效，支援 Wi-Fi 6。',
 39900, '3C', 'https://picsum.photos/seed/tech-04/800/600', 4.5),

('iPad Air M2 11吋 WiFi 256GB',
 'M2 晶片效能飛躍，支援 Apple Pencil Pro 與 Magic Keyboard，液態視網膜顯示器。',
 21900, '3C', 'https://picsum.photos/seed/tech-05/800/600', 4.9),

('HHKB Professional Hybrid 靜電容鍵盤',
 '60 鍵靜電容式開關，藍牙 / USB 雙模，四台裝置快速切換，頂級打字手感。',
 12800, '3C', 'https://picsum.photos/seed/tech-06/800/600', 4.7),

('Anker 735 GaN 65W 充電器',
 'GaN II 技術，三孔同時輸出 65W，輕薄折疊插頭，相容 PD3.0 / QC4.0 快充協議。',
 990, '3C', 'https://picsum.photos/seed/tech-07/800/600', 4.5),

('Sony ZV-E10 APS-C 無反相機',
 '2420 萬像素，支援 4K 30fps 影片，翻轉螢幕，內建指向麥克風，vlog 首選。',
 22900, '3C', 'https://picsum.photos/seed/tech-08/800/600', 4.6),

('Bose QuietComfort 45 藍牙耳機',
 '主動降噪與通透模式切換，EQ 調音設定，22 小時續航，舒適輕量，多裝置連線。',
 11990, '3C', 'https://picsum.photos/seed/tech-09/800/600', 4.5),

('iPhone 16 保護殼 MagSafe 相容',
 '軍規防摔認證，精準開孔，MagSafe 磁吸貼合，TPU + PC 複合材質，多色可選。',
 1290, '3C', 'https://picsum.photos/seed/tech-10/800/600', 4.3),

-- 服飾（10 筆）
('Uniqlo 超輕量羽絨背心',
 '90% 羽絨填充，極輕薄可收納入袋，內建口袋，多色可選，S～3XL 完整尺碼。',
 1490, '服飾', 'https://picsum.photos/seed/fashion-01/800/600', 4.6),

('Uniqlo HEATTECH 極暖發熱衣圓領',
 '第 3 代 HEATTECH 材質，保暖效果是原版 1.5 倍，吸濕發熱纖維，輕薄不悶熱。',
 590, '服飾', 'https://picsum.photos/seed/fashion-02/800/600', 4.7),

('Levi''s 511 修身牛仔褲',
 '中腰修身版型，略收腳踝，彈性布料自由活動，水洗深藍色，百搭日常穿搭首選。',
 2990, '服飾', 'https://picsum.photos/seed/fashion-03/800/600', 4.4),

('Nike Dri-FIT 運動機能短袖',
 'Dri-FIT 快乾技術，保持乾爽舒適，圓領剪裁，輕量透氣，適合訓練與日常穿搭。',
 990, '服飾', 'https://picsum.photos/seed/fashion-04/800/600', 4.3),

('Adidas Essentials 三線長褲',
 '標誌性三線設計，鬆緊腰頭附抽繩，深度側袋，棉質混紡舒適親膚，居家/外出兩用。',
 1790, '服飾', 'https://picsum.photos/seed/fashion-05/800/600', 4.4),

('MIT 台灣製有機棉 Oversize T恤',
 '台灣在地品牌，有機棉認證，寬鬆版型，落肩設計，素色百搭，手洗不縮水。',
 490, '服飾', 'https://picsum.photos/seed/fashion-06/800/600', 4.2),

('Uniqlo 刷毛連帽外套',
 '超細纖維刷毛材質，輕量保暖，拉鍊口袋設計，前拉鍊開合，居家外出皆宜。',
 1290, '服飾', 'https://picsum.photos/seed/fashion-07/800/600', 4.5),

('Champion 大C 刺繡連帽衛衣',
 '經典學院風，360g 重磅棉，大口袋設計，寬鬆落肩版型，復古水洗處理。',
 1890, '服飾', 'https://picsum.photos/seed/fashion-08/800/600', 4.5),

('亞麻寬鬆九分闊腿褲',
 '天然亞麻 55% + 棉 45%，透氣吸濕，鬆緊腰頭，自然垂墜感，春夏秋三季皆宜。',
 1290, '服飾', 'https://picsum.photos/seed/fashion-09/800/600', 4.3),

('New Balance 327 復古慢跑鞋',
 'N Logo 側面刺繡，混合材質鞋面，ENCAP 中底技術，復古厚底輪廓，街頭穿搭神款。',
 3490, '服飾', 'https://picsum.photos/seed/fashion-10/800/600', 4.6),

-- 食品（10 筆）
('日本宇治 辻利抹茶粉 100g',
 '京都宇治直送，石臼研磨，清爽回甘，適合沖泡、烘焙、甜品，無農藥認證。',
 380, '食品', 'https://picsum.photos/seed/food-01/800/600', 4.7),

('台灣高山烏龍茶葉禮盒 150g',
 '梨山茶區 2500 公尺高山採摘，果香花香交融，輕焙烘製，附精美茶葉罐禮盒。',
 950, '食品', 'https://picsum.photos/seed/food-02/800/600', 4.8),

('韓國農心辛拉麵 5 包裝',
 '韓國銷售冠軍，牛骨高湯底，辛辣醇厚，粗麵有嚼勁，附蔬菜包與醬料包。',
 180, '食品', 'https://picsum.photos/seed/food-03/800/600', 4.5),

('義大利 De Cecco 有機義大利麵 500g',
 '義大利有機小麥製，銅模擠壓保留粗糙表面，更易掛醬，煮後口感彈Q有嚼勁。',
 290, '食品', 'https://picsum.photos/seed/food-04/800/600', 4.6),

('Colavita 特級初榨橄欖油 500ml',
 '義大利原裝進口，冷壓第一道萃取，DOP 認證，果香濃郁，適合涼拌、烹飪與沾麵包。',
 590, '食品', 'https://picsum.photos/seed/food-05/800/600', 4.7),

('台灣手工牛軋糖禮盒 18 入',
 '新鮮奶油慢火熬製，花生夏威夷豆雙拼，酥脆不黏牙，附緞帶禮盒，伴手禮首選。',
 420, '食品', 'https://picsum.photos/seed/food-06/800/600', 4.6),

('紐西蘭 Harraways 有機即食燕麥片 1kg',
 '有機認證大燕麥片，富含 beta-葡聚醣，3 分鐘即食，無添加糖與人工色素。',
 350, '食品', 'https://picsum.photos/seed/food-07/800/600', 4.4),

('日本 Glico Pocky 草莓餅乾棒 6袋入',
 '日本直送，草莓口味香濃，外層薄脆可可餅乾，雙層口感，零嘴追劇最佳選擇。',
 220, '食品', 'https://picsum.photos/seed/food-08/800/600', 4.3),

('台灣鳳梨酥禮盒 12 入',
 '100% 台灣土鳳梨，不加冬瓜，內餡酸甜適中，酥皮奶香四溢，附精裝禮盒提袋。',
 480, '食品', 'https://picsum.photos/seed/food-09/800/600', 4.8),

('台灣黑糖珍珠奶茶包 10 入',
 '台灣黑糖熬製，隨沖即飲，附珍珠煮包，只需加熱水與牛奶，5 分鐘手搖在家做。',
 280, '食品', 'https://picsum.photos/seed/food-10/800/600', 4.5);

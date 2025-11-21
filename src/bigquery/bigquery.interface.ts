export interface View {
  id: string; // VJPNKIX01, VJPNHYO15 等
  name: string; // AI 輸出的 abstract_2 內嵌的簡潔名稱
  raw_name: string; // 原始文案，通常更長更完整
  description: string; // 景點詳情
  city: string; // 城市資訊 (例如: "日本 大阪")
  tags: string[]; // 原始標籤清單
  lat: number;
  lng: number;
}

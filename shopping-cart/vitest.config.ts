import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // 每個測試檔案序列執行（避免 DB 資料競爭）
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
  },
})

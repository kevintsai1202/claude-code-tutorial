import { Pool } from 'pg'

/** PostgreSQL 連線池（所有 service 共用此 pool） */
export const pool = new Pool({
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME     ?? 'shopcart',
  user:     process.env.DB_USER     ?? 'shopcart',
  password: process.env.DB_PASSWORD ?? 'shopcart',
  max: 10,           // 最大連線數
  idleTimeoutMillis: 30000,
})

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err)
})

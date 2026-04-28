import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { sessionMiddleware } from './middleware/sessionMiddleware'
import productRoutes from './routes/products.routes'
import cartRoutes from './routes/cart.routes'

export const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(sessionMiddleware)

app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)

// 全域錯誤處理（express error handler 需要四個參數才會生效）
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// 僅在直接執行（非測試 import）時才啟動 HTTP 監聽
if (require.main === module) {
  app.listen(3001, () => {
    console.log('Server running on http://localhost:3001')
  })
}

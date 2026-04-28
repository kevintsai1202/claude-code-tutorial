import { randomUUID } from 'crypto'
import type { Request, Response, NextFunction } from 'express'

/** 讓 Express Request 帶上 sessionId（由後端 UUID 產生，不接受客戶端自定義） */
declare global {
  namespace Express {
    interface Request {
      sessionId: string
    }
  }
}

/** 讀取或建立 shopcart_session Cookie，將 sessionId 掛在 req 上 */
export function sessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  let sessionId = req.cookies?.shopcart_session as string | undefined

  if (!sessionId) {
    sessionId = randomUUID()
    res.cookie('shopcart_session', sessionId, {
      httpOnly: true,
      maxAge:   7 * 24 * 60 * 60 * 1000, // 7 天
      sameSite: 'lax',
    })
  }

  req.sessionId = sessionId
  next()
}

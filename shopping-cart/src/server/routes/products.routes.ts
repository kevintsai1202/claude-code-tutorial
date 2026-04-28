import { Router } from 'express'
import * as productService from '../services/productService'

const router = Router()

/** GET /api/products?category=&search= — 商品列表（支援篩選與搜尋） */
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query as { category?: string; search?: string }
    const result = await productService.findAll(category, search)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/** GET /api/products/:id — 單一商品詳情 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid product id' })
      return
    }
    const product = await productService.findById(id)
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

import { Router, type Request, type Response } from 'express'
import { chatWithRole } from '../services/litellmService.js'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    const { role, context, messages } = req.body || {}
    if (!role || typeof role !== 'string') {
      res.status(400).json({ success: false, error: '缺少角色参数' })
      return
    }
    if (!Array.isArray(messages)) {
      res.status(400).json({ success: false, error: '缺少消息列表' })
      return
    }
    const reply = await chatWithRole(role, context || '', messages)
    res.json({ success: true, data: { reply } })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || '内部服务器错误' })
  }
})

export default router

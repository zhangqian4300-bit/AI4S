import { Router, type Request, type Response } from 'express';
import { translateText } from '../services/litellmService.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ success: false, error: '无效输入。请提供文本内容。' });
      return;
    }

    const result = await translateText(text);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Translation Route Error:', error);
    res.status(500).json({ success: false, error: error.message || '内部服务器错误' });
  }
});

export default router;

import { Router, type Request, type Response } from 'express'
import multer from 'multer'
import JSZip from 'jszip'
import { createRequire } from 'module'
const requireCJS = createRequire(import.meta.url)
const pdfParse = requireCJS('pdf-parse')
const mammoth = requireCJS('mammoth')
const xlsx = requireCJS('xlsx')
const { parseStringPromise } = requireCJS('xml2js')

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } })

const getExt = (filename: string) => filename.split('.').pop()?.toLowerCase() || ''

const parsePdf = async (buf: Buffer) => {
  const data = await pdfParse(buf)
  return data.text || ''
}

const parseDocx = async (buf: Buffer) => {
  const res = await mammoth.extractRawText({ buffer: buf })
  return res.value || ''
}

const parsePptx = async (buf: Buffer) => {
  const zip = await JSZip.loadAsync(buf)
  const slides: string[] = []
  const files = Object.keys(zip.files).filter(p => p.startsWith('ppt/slides/slide') && p.endsWith('.xml'))
  files.sort()
  for (const path of files) {
    const xml = await zip.files[path].async('string')
    const json = await parseStringPromise(xml, { explicitArray: true })
    const texts: string[] = []
    const walk = (node: any) => {
      if (!node || typeof node !== 'object') return
      if (node['a:t']) {
        for (const t of node['a:t']) {
          if (typeof t === 'string') texts.push(t)
        }
      }
      for (const k of Object.keys(node)) {
        const v = node[k]
        if (Array.isArray(v)) v.forEach(walk)
        else if (typeof v === 'object') walk(v)
      }
    }
    walk(json)
    slides.push(texts.join(' '))
  }
  return slides.join('\n\n')
}

const parseXlsx = async (buf: Buffer) => {
  const wb = xlsx.read(buf, { type: 'buffer' })
  const parts: string[] = []
  for (const name of wb.SheetNames) {
    const sheet = wb.Sheets[name]
    const csv = xlsx.utils.sheet_to_csv(sheet)
    parts.push(`# ${name}\n${csv}`)
  }
  return parts.join('\n\n')
}

const parseCsv = async (buf: Buffer) => {
  return buf.toString('utf8')
}

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = (req as any).file
    if (!file) {
      res.status(400).json({ success: false, error: '请上传文件' })
      return
    }
    const ext = getExt(file.originalname)
    let text = ''
    if (ext === 'pdf') text = await parsePdf(file.buffer)
    else if (ext === 'docx') text = await parseDocx(file.buffer)
    else if (ext === 'pptx') text = await parsePptx(file.buffer)
    else if (ext === 'xlsx' || ext === 'xls') text = await parseXlsx(file.buffer)
    else if (ext === 'csv') text = await parseCsv(file.buffer)
    else {
      res.status(400).json({ success: false, error: '不支持的文件格式，仅支持 pdf、docx、pptx、xlsx、csv' })
      return
    }
    res.json({
      success: true,
      data: {
        text,
        meta: {
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          ext,
        }
      }
    })
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || '解析失败' })
  }
})

export default router

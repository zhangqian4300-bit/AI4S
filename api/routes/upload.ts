import { Router, type Request, type Response } from 'express'
import multer from 'multer'
import JSZip from 'jszip'
import { readFile, unlink } from 'fs/promises'
import os from 'os'
import { createRequire } from 'module'
const requireCJS = createRequire(import.meta.url)
const pdfParseModule = requireCJS('pdf-parse')
const PDFParseClass = pdfParseModule.PDFParse
const mammoth = requireCJS('mammoth')
const xlsx = requireCJS('xlsx')
const { parseStringPromise } = requireCJS('xml2js')

const router = Router()
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, os.tmpdir())
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}-${file.originalname}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } })

const getExt = (filename: string) => filename.split('.').pop()?.toLowerCase() || ''

type UploadFile = {
  originalname: string
  mimetype: string
  size: number
  path?: string
  buffer?: Buffer
}

const getFileBuffer = async (file: UploadFile): Promise<Buffer> => {
  if (file?.buffer) return file.buffer
  if (file?.path) return await readFile(file.path)
  throw new Error('无法读取文件内容')
}

let activeParsers = 0
const maxParsers = 2
const waitForParser = async (): Promise<void> => {
  while (activeParsers >= maxParsers) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  activeParsers++
}
const releaseParser = (): void => {
  if (activeParsers > 0) activeParsers--
}

const parsePdf = async (buf: Buffer) => {
  if (!PDFParseClass) throw new Error('PDF parser not available')
  await waitForParser()
  const parser = new PDFParseClass({ data: buf })
  const result = await parser.getText()
  if (typeof parser.destroy === 'function') await parser.destroy()
  releaseParser()
  return result.text || ''
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
    const walk = (node: unknown) => {
      if (!node || typeof node !== 'object') return
      const obj = node as Record<string, unknown>
      const at = obj['a:t']
      if (Array.isArray(at)) {
        for (const t of at) {
          if (typeof t === 'string') texts.push(t)
        }
      }
      for (const k of Object.keys(obj)) {
        const v = obj[k]
        if (Array.isArray(v)) (v as unknown[]).forEach(walk)
        else if (typeof v === 'object' && v !== null) walk(v)
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
    const file = (req as unknown as { file?: UploadFile }).file
    if (!file) {
      res.status(400).json({ success: false, error: '请上传文件' })
      return
    }
    const ext = getExt(file.originalname)
    let text = ''
    const buf = await getFileBuffer(file)
    if (ext === 'pdf') text = await parsePdf(buf)
    else if (ext === 'docx') text = await parseDocx(buf)
    else if (ext === 'pptx') text = await parsePptx(buf)
    else if (ext === 'xlsx' || ext === 'xls') text = await parseXlsx(buf)
    else if (ext === 'csv') text = await parseCsv(buf)
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
    if (file?.path) {
      await unlink(file.path).then(() => true).catch(() => false)
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    res.status(500).json({ success: false, error: message || '解析失败' })
  }
})

export default router

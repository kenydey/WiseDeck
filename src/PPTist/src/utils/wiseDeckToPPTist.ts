/**
 * WiseDeck 到 PPTist 格式转换工具 - 增强版
 * 支持更多元素类型和样式
 */

import type { Slide, PPTTextElement, PPTImageElement, SlideBackground } from '@/types/slides'
import {
  WISEDECK_VIEWPORT_HEIGHT,
  WISEDECK_VIEWPORT_WIDTH,
} from '@/configs/wisedeckCanvas'

interface WiseDeckSlide {
  slide_id?: string
  id?: string
  title?: string
  html_content?: string
  page_number?: number
  elements?: any[]
  background?: any
  [key: string]: any
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 12)
}

function cleanHtmlContent(content: string): string {
  let text = content.replace(/<[^>]+>/g, '')
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#39;/g, "'")
  text = text.replace(/\s+/g, ' ').trim()
  return text
}

function extractBackgroundColor(slide: WiseDeckSlide, html: string): string {
  // 优先从slide.background获取
  if (slide.background && slide.background.color) {
    return slide.background.color
  }
  
  // 从HTML style属性提取
  const bgMatch = html.match(/background[-:]?\s*color[:\s]*\s*([^;]+);?/i)
  if (bgMatch) {
    let color = bgMatch[1].trim().toLowerCase()
    if (color.startsWith('#') && color.length === 4) {
      color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
    }
    return color
  }
  
  // 默认背景色（从截图看是米色）
  return '#f5f2eb'
}

function extractBackgroundImage(html: string): string | null {
  const bgImageMatch = html.match(/background[-:]?\s*image[:\s]*\s*url\(["']?([^"')]+)["']?\)/i)
  if (bgImageMatch) {
    return bgImageMatch[1]
  }
  return null
}

function parseStyle(styleStr: string | null | undefined): {
  fontSize?: number
  fontWeight?: string
  textAlign?: string
  color?: string
} {
  if (!styleStr) return {}
  
  const styles: { [key: string]: string } = {}
  const pairs = styleStr.split(';')
  
  for (const pair of pairs) {
    const [key, value] = pair.split(':').map(s => s.trim())
    if (key && value) {
      styles[key.toLowerCase()] = value
    }
  }
  
  return {
    fontSize: styles['font-size'] ? parseFloat(styles['font-size']) : undefined,
    fontWeight: styles['font-weight'] || undefined,
    textAlign: styles['text-align'] || undefined,
    color: styles['color'] || undefined
  }
}

function extractElements(html: string): Array<{
  type: string
  content?: string
  src?: string
  level?: number
  style?: string | null
}> {
  const elements: Array<{ type: string; content?: string; src?: string; level?: number; style?: string | null }> = []

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const processNode = (node: Node, depth: number = 0) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return
    }

    const element = node as HTMLElement
    
    // 检查tagName是否存在，某些节点类型（如注释）没有tagName
    if (!element.tagName) {
      element.childNodes.forEach(child => processNode(child, depth + 1))
      return
    }
    
    const tagName = element.tagName.toLowerCase()

    if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4') {
      const level = parseInt(tagName[1]) || 1
      const content = cleanHtmlContent(element.innerHTML)
      if (content) {
        elements.push({ type: 'heading', content, level, style: element.getAttribute('style') })
      }
    } else if (tagName === 'p') {
      const content = cleanHtmlContent(element.innerHTML)
      if (content && !content.startsWith('•') && !content.startsWith('-')) {
        elements.push({ type: 'paragraph', content, style: element.getAttribute('style') })
      }
    } else if (tagName === 'li') {
      const content = cleanHtmlContent(element.innerHTML)
      if (content) {
        elements.push({ type: 'list_item', content, style: element.getAttribute('style') })
      }
    } else if (tagName === 'img') {
      const src = element.getAttribute('src')
      if (src) {
        elements.push({ type: 'image', src, style: element.getAttribute('style') })
      }
    } else if (tagName === 'div') {
      const bgColor = element.style.backgroundColor || element.getAttribute('bgcolor')
      if (bgColor && bgColor !== 'transparent') {
        elements.push({ type: 'background', content: bgColor })
      }
    }

    element.childNodes.forEach(child => processNode(child, depth + 1))
  }

  doc.body.childNodes.forEach(child => processNode(child))

  if (elements.length === 0 && html.trim()) {
    elements.push({ type: 'paragraph', content: cleanHtmlContent(html) })
  }

  return elements
}

function createTextElement(
  content: string,
  left: number,
  top: number,
  width: number,
  height: number,
  options: {
    fontSize?: number
    fontWeight?: string
    textAlign?: string
    color?: string
  } = {}
): PPTTextElement {
  return {
    id: generateId(),
    type: 'text',
    left,
    top,
    width,
    height,
    rotate: 0,
    content,
    defaultFontName: '微软雅黑',
    defaultColor: options.color || '#333333',
    lineHeight: 1.5,
    wordSpace: 0,
    opacity: 1,
    paragraphSpace: 5,
    vertical: false,
    textType: 'content'
  }
}

function createImageElement(
  src: string,
  left: number,
  top: number,
  width: number,
  height: number
): PPTImageElement {
  return {
    id: generateId(),
    type: 'image',
    left,
    top,
    width,
    height,
    rotate: 0,
    fixedRatio: true,
    src,
    outline: {
      style: 'solid',
      width: 0,
      color: '#000000'
    }
  }
}

function detectSlideFormat(slides: any[]): 'pptist' | 'wisedeck' {
  if (!slides || slides.length === 0) return 'wisedeck'

  const firstSlide = slides[0]

  if (firstSlide.elements && Array.isArray(firstSlide.elements)) {
    return 'pptist'
  }

  if (firstSlide.html_content !== undefined || firstSlide.title !== undefined) {
    return 'wisedeck'
  }

  return 'pptist'
}

export function convertWiseDeckSlidesToPPTist(slides: WiseDeckSlide[]): Slide[] {
  const canvasWidth = WISEDECK_VIEWPORT_WIDTH
  const canvasHeight = WISEDECK_VIEWPORT_HEIGHT
  const margin = 60
  const contentWidth = canvasWidth - 2 * margin

  const format = detectSlideFormat(slides)

  if (format === 'pptist') {
    return slides.map((slide: any) => ({
      id: slide.id || slide.slide_id || generateId(),
      elements: slide.elements || [],
      notes: slide.notes || [],
      remark: slide.remark || '',
      background: slide.background || { type: 'solid', color: '#ffffff' },
      animations: slide.animations || [],
      turningMode: slide.turningMode,
      sectionTag: slide.sectionTag,
      type: slide.type
    }))
  }

  return slides.map((slide, slideIndex) => {
    const slideId = slide.slide_id || slide.id || generateId()
    const htmlContent = slide.html_content || ''
    const title = slide.title || ''

    const elements: (PPTTextElement | PPTImageElement)[] = []
    let currentY = margin + 30  // 增加顶部边距

    // 从多个来源提取背景颜色
    const bgColor = extractBackgroundColor(slide, htmlContent)
    const bgImage = extractBackgroundImage(htmlContent)

    // 标题处理（如果有标题字段）
    if (title) {
      elements.push(createTextElement(
        title,
        margin,
        currentY,
        contentWidth,
        60,
        { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#333333' }
      ))
      currentY += 80
      
      // 添加装饰线
      elements.push(createTextElement(
        '──────────────────────────────────────────────────────────────',
        margin,
        currentY,
        contentWidth,
        20,
        { fontSize: 14, fontWeight: 'normal', textAlign: 'center', color: '#d4a574' }
      ))
      currentY += 35
    }

    const extractedElements = extractElements(htmlContent)

    for (const item of extractedElements) {
      const parsedStyle = parseStyle(item.style)
      
      if (item.type === 'heading') {
        const fontSize = item.level === 1 ? 36 : item.level === 2 ? 28 : item.level === 3 ? 24 : 22
        const elementHeight = fontSize + 20
        elements.push(createTextElement(
          item.content || '',
          margin,
          currentY,
          contentWidth,
          elementHeight,
          { 
            fontSize: parsedStyle.fontSize || fontSize, 
            fontWeight: parsedStyle.fontWeight || 'bold', 
            textAlign: parsedStyle.textAlign || (item.level === 1 ? 'center' : 'left'), 
            color: parsedStyle.color || '#333333' 
          }
        ))
        currentY += elementHeight + 20
      } else if (item.type === 'paragraph') {
        const elementHeight = 48
        elements.push(createTextElement(
          item.content || '',
          margin,
          currentY,
          contentWidth,
          elementHeight,
          { 
            fontSize: parsedStyle.fontSize || 18, 
            fontWeight: parsedStyle.fontWeight || 'normal', 
            textAlign: parsedStyle.textAlign || 'left', 
            color: parsedStyle.color || '#444444' 
          }
        ))
        currentY += elementHeight + 12
      } else if (item.type === 'list_item') {
        const elementHeight = 38
        elements.push(createTextElement(
          `• ${item.content || ''}`,
          margin + 40,
          currentY,
          contentWidth - 40,
          elementHeight,
          { 
            fontSize: parsedStyle.fontSize || 18, 
            fontWeight: parsedStyle.fontWeight || 'normal', 
            textAlign: parsedStyle.textAlign || 'left', 
            color: parsedStyle.color || '#555555' 
          }
        ))
        currentY += elementHeight + 8
      } else if (item.type === 'image' && item.src) {
        const elementHeight = 280
        elements.push(createImageElement(
          item.src,
          margin,
          currentY,
          contentWidth,
          elementHeight
        ))
        currentY += elementHeight + 25
      }
    }

    const background: SlideBackground = {
      type: bgImage ? 'image' : 'solid',
      color: bgColor
    }
    if (bgImage) {
      background.image = { src: bgImage, size: 'cover' }
    }

    return {
      id: slideId,
      elements,
      notes: [],
      remark: '',
      background,
      animations: [],
      turningMode: undefined,
      sectionTag: undefined,
      type: undefined
    }
  })
}

export function convertWiseDeckSlideToPPTist(slide: WiseDeckSlide): Slide {
  return convertWiseDeckSlidesToPPTist([slide])[0]
}

export { detectSlideFormat }

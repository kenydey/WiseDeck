/**
 * Client-side normalization for pptx_bridge slides (fixes legacy DB elements before render).
 */
import { nanoid } from 'nanoid'
import type { ChartData, ChartOptions, ChartType, Slide } from '@/types/slides'

const DEFAULT_THEME_COLORS = ['#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47']
const VENDOR_ECHARTS = '/static/vendor/echarts.min.js'
const VENDOR_CHART_UMD = '/static/vendor/chart.umd.min.js'

const MINIMAL_CHART_DATA: ChartData = {
  labels: [''],
  legends: [''],
  series: [[0]],
}

export function rewriteChartCdnInHtml(html: string): string {
  if (!html || typeof html !== 'string') return html
  return html
    .replace(
      /<script\b[^>]*\bsrc\s*=\s*["']https?:\/\/[^"']*\/echarts[^"']*\.min\.js["'][^>]*>\s*<\/script>/gi,
      `<script src="${VENDOR_ECHARTS}"></script>`,
    )
    .replace(
      /<script\b[^>]*\bsrc\s*=\s*["']https?:\/\/[^"']*\/chart\.umd(?:\.min)?\.js["'][^>]*>\s*<\/script>/gi,
      `<script src="${VENDOR_CHART_UMD}"></script>`,
    )
}

function isPptistChart(el: Record<string, unknown>): boolean {
  if (el.type !== 'chart') return false
  const data = el.data as ChartData | undefined
  return !!(data && Array.isArray(data.series) && data.series.length > 0 && Array.isArray(data.series[0]))
}

interface ChartItem {
  key: string
  values: { y: number }[]
  xlabels: Record<string, string>
}

function pptistChartType(raw: string, el: Record<string, unknown>): { chartType: ChartType; options: ChartOptions } {
  const options: ChartOptions = {}
  const grouping = el.grouping as string | undefined
  if (grouping === 'stacked' || grouping === 'percentStacked') options.stack = true

  switch (raw) {
    case 'barChart':
    case 'bar3DChart':
      return { chartType: el.barDir === 'bar' ? 'column' : 'bar', options }
    case 'lineChart':
    case 'line3DChart':
      return { chartType: 'line', options }
    case 'areaChart':
    case 'area3DChart':
      return { chartType: 'area', options }
    case 'scatterChart':
    case 'bubbleChart':
      return { chartType: 'scatter', options }
    case 'pieChart':
    case 'pie3DChart':
      return { chartType: 'pie', options }
    case 'radarChart':
      return { chartType: 'radar', options }
    case 'doughnutChart':
      return { chartType: 'ring', options }
    default:
      return { chartType: 'bar', options }
  }
}

function buildMinimalChartElement(el: Record<string, unknown>, themeColors: string[]): Record<string, unknown> {
  const colors = (Array.isArray(el.themeColors) && (el.themeColors as string[]).length
    ? el.themeColors
    : themeColors.length
      ? themeColors
      : DEFAULT_THEME_COLORS) as string[]
  const rawType = String(el.chartType || 'barChart')
  const { chartType, options } = pptistChartType(rawType, el)
  return {
    ...el,
    type: 'chart',
    id: (el.id as string) || nanoid(10),
    chartType,
    themeColors: colors,
    textColor: el.textColor || '#333333',
    lineColor: el.lineColor || '#e5e5e5',
    data: MINIMAL_CHART_DATA,
    options,
  }
}

function normalizeChartElement(el: Record<string, unknown>, themeColors: string[]): Record<string, unknown> | null {
  if (isPptistChart(el)) {
    const data = el.data as ChartData
    if (!data.series?.[0]?.length) {
      return buildMinimalChartElement(el, themeColors)
    }
    const out = { ...el }
    if (!Array.isArray(out.themeColors) || !(out.themeColors as string[]).length) {
      out.themeColors = themeColors.length ? themeColors : DEFAULT_THEME_COLORS
    }
    return out
  }

  const rawType = String(el.chartType || '')
  const rawData = el.data
  let labels: string[] = []
  let legends: string[] = []
  let series: number[][] = []

  try {
    if ((rawType === 'scatterChart' || rawType === 'bubbleChart') && Array.isArray(rawData) && rawData.length >= 2) {
      const first = rawData[0] as number[]
      labels = first.map((_, index) => `坐标${index + 1}`)
      legends = ['X', 'Y']
      series = (rawData as number[][]).slice(0, 2).map(row =>
        row.map(v => (typeof v === 'number' ? v : 0)),
      )
    }
    else if (Array.isArray(rawData) && rawData.length) {
      const data = rawData as ChartItem[]
      if (data[0]?.xlabels) {
        labels = Object.values(data[0].xlabels)
        legends = data.map(item => String(item.key || ''))
        series = data.map(item =>
          (item.values || []).map(v => (typeof v === 'object' && v && 'y' in v ? Number(v.y) : 0)),
        )
      }
    }
  }
  catch {
    return buildMinimalChartElement(el, themeColors)
  }

  if (!series.length || !series[0]?.length) {
    return buildMinimalChartElement(el, themeColors)
  }

  const colors = (Array.isArray(el.colors) && el.colors.length
    ? el.colors
    : Array.isArray(el.themeColors) && (el.themeColors as string[]).length
      ? el.themeColors
      : themeColors.length
        ? themeColors
        : DEFAULT_THEME_COLORS) as string[]

  const { chartType, options } = pptistChartType(rawType, el)

  return {
    ...el,
    type: 'chart',
    id: (el.id as string) || nanoid(10),
    chartType,
    themeColors: colors,
    textColor: el.textColor || '#333333',
    lineColor: el.lineColor || '#e5e5e5',
    data: { labels, legends, series } as ChartData,
    options,
  }
}

function normalizeTableElement(el: Record<string, unknown>): Record<string, unknown> | null {
  const raw = el.data
  if (!Array.isArray(raw) || !raw.length || !Array.isArray(raw[0]) || !raw[0].length) return null

  const rows = raw.length
  const cols = (raw[0] as unknown[]).length
  const tableData: { id: string; colspan: number; rowspan: number; text: string; style: Record<string, unknown> }[][] = []

  for (let i = 0; i < rows; i++) {
    const srcRow = raw[i] as Record<string, unknown>[]
    const rowCells = []
    for (let j = 0; j < cols; j++) {
      const cell = (srcRow[j] || {}) as Record<string, unknown>
      const div = document.createElement('div')
      div.innerHTML = String(cell.text || '')
      rowCells.push({
        id: nanoid(10),
        colspan: Number(cell.colSpan || cell.colspan || 1),
        rowspan: Number(cell.rowSpan || cell.rowspan || 1),
        text: div.innerText || '',
        style: {
          align: 'left',
          valign: 'middle',
          fontsize: '',
          fontname: '',
          color: cell.fontColor || '#333',
          bold: !!cell.fontBold,
          backcolor: cell.fillColor || '',
        },
      })
    }
    if (rowCells.length) tableData.push(rowCells)
  }

  if (!tableData.length) return null

  const colWidthsRaw = el.colWidths as number[] | undefined
  let colWidths: number[]
  if (Array.isArray(colWidthsRaw) && colWidthsRaw.length) {
    const total = colWidthsRaw.reduce((a, b) => a + b, 0)
    colWidths = total > 0 ? colWidthsRaw.map(w => w / total) : Array(cols).fill(1 / cols)
  }
  else {
    colWidths = Array(cols).fill(1 / cols)
  }

  return {
    ...el,
    type: 'table',
    id: (el.id as string) || nanoid(10),
    data: tableData,
    colWidths,
  }
}

function rewriteCdnInUnknown(value: unknown): unknown {
  if (typeof value === 'string') {
    return rewriteChartCdnInHtml(value)
  }
  if (Array.isArray(value)) {
    return value.map(v => rewriteCdnInUnknown(v))
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = rewriteCdnInUnknown(v)
    }
    return out
  }
  return value
}

function normalizeImageElement(el: Record<string, unknown>): Record<string, unknown> {
  const src = el.src
  if (typeof src !== 'string' || !src.includes('/api/image/view/')) {
    return el
  }
  if (src.startsWith('data:')) {
    return el
  }
  if (src.includes('/api/image/view/public_')) {
    return { ...el, src, wisedeckPublicImagePending: true }
  }
  return el
}

function normalizeElement(el: Record<string, unknown>, themeColors: string[]): Record<string, unknown> | null {
  const t = el.type
  if (t === 'chart') return normalizeChartElement(el, themeColors)
  if (t === 'table') return normalizeTableElement(el)
  if (t === 'image') return normalizeImageElement(el)
  return rewriteCdnInUnknown(el) as Record<string, unknown>
}

export function normalizeSlidesFromPptxBridge(
  slides: Slide[],
  themeColors?: string[],
): Slide[] {
  const theme = themeColors?.length ? themeColors : DEFAULT_THEME_COLORS
  return slides.map(slide => {
    const elements = (slide.elements || [])
      .map(el => normalizeElement(el as unknown as Record<string, unknown>, theme))
      .filter((el): el is Record<string, unknown> => el !== null)
    return { ...slide, elements: elements as Slide['elements'] }
  })
}

/**
 * Mirrors Python `wds_aippt_v1` for frontend tooling / prompts (keep field names in sync).
 */

export type WdsAipptSlideType =
  | 'cover'
  | 'contents'
  | 'transition'
  | 'content'
  | 'end'
  | 'reference'

export interface WdsAssemblyPrefs {
  use_pptx_bridge?: boolean
  force_raster?: boolean
}

export interface WdsAIPPTImage {
  id?: string
  src: string
  width?: number
  height?: number
}

export interface CoverData {
  title?: string
  text?: string
}

export interface ContentsData {
  items?: string[]
}

export interface TransitionData {
  title?: string
  text?: string
}

export interface ContentBulletItem {
  title?: string
  text?: string
}

export interface ContentTextItem {
  kind: 'text'
  title?: string
  text?: string
}

export interface AIPPTChartSeries {
  label?: string
  data?: number[]
}

export interface ContentChartItem {
  kind: 'chart'
  chartType?: string
  labels?: string[]
  series?: AIPPTChartSeries[]
}

export interface ContentImageItem {
  kind: 'image'
  src?: string
  width?: number
  height?: number
  title?: string
  text?: string
}

export type ContentItem =
  | ContentBulletItem
  | ContentTextItem
  | ContentChartItem
  | ContentImageItem

export interface ContentData {
  title?: string
  items?: ContentItem[]
}

export interface ReferenceData {
  title?: string
  items?: ContentBulletItem[]
}

export interface WDSlideCover {
  type: 'cover'
  data?: CoverData
  images?: WdsAIPPTImage[]
}

export interface WDSlideContents {
  type: 'contents'
  data?: ContentsData
  images?: WdsAIPPTImage[]
}

export interface WDSlideTransition {
  type: 'transition'
  data?: TransitionData
  images?: WdsAIPPTImage[]
}

export interface WDSlideContent {
  type: 'content'
  data?: ContentData
  images?: WdsAIPPTImage[]
}

export interface WDSlideEnd {
  type: 'end'
  data?: CoverData
}

export interface WDSlideReference {
  type: 'reference'
  data?: ReferenceData
}

export type WDSAnySlide =
  | WDSlideCover
  | WDSlideContents
  | WDSlideTransition
  | WDSlideContent
  | WDSlideEnd
  | WDSlideReference

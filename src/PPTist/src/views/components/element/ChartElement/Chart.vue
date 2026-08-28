<template>
  <div class="chart" ref="chartRef"></div>
</template>

<script lang="ts" setup>
import { onMounted, useTemplateRef, computed, watch } from 'vue'
import tinycolor from 'tinycolor2'
import type { ChartData, ChartOptions, ChartType } from '@/types/slides'
import { getChartOption } from './chartOption'

import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart, ScatterChart, RadarChart } from 'echarts/charts'
import { LegendComponent } from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  LegendComponent,
  SVGRenderer,
])

const props = defineProps<{
  width: number
  height: number
  type: ChartType
  data: ChartData
  themeColors: string[]
  textColor?: string
  lineColor?: string
  options?: ChartOptions
}>()

let chart: echarts.ECharts | null = null
const chartRef = useTemplateRef<HTMLElement>('chartRef')

const themeColors = computed(() => {
  const base = Array.isArray(props.themeColors) && props.themeColors.length
    ? props.themeColors
    : ['#4472c4', '#ed7d31', '#a5a5a5', '#ffc000']
  let colors: string[] = []
  if (base.length >= 10) colors = base
  else if (base.length === 1) colors = tinycolor(base[0]).analogous(10).map(color => color.toRgbString())
  else {
    const len = base.length
    const supplement = tinycolor(base[len - 1]).analogous(10 + 1 - len).map(color => color.toRgbString())
    colors = [...base.slice(0, len - 1), ...supplement]
  }
  return colors
})

const updateOption = () => {
  const option = getChartOption({
    type: props.type,
    data: props.data,
    themeColors: themeColors.value,
    textColor: props.textColor,
    lineColor: props.lineColor,
    lineSmooth: props.options?.lineSmooth || false,
    stack: props.options?.stack || false,
  })
  if (option && chart) chart.setOption(option, true)
}

onMounted(() => {
  chart = echarts.init(chartRef.value, null, { renderer: 'svg' })
  updateOption()

  const resizeListener = () => chart!.resize()
  const resizeObserver = new ResizeObserver(resizeListener)
  resizeObserver.observe(chartRef.value!)
})

watch(() => props.type, updateOption)
watch(() => props.data, updateOption)
watch(() => props.themeColors, updateOption)
watch(() => props.textColor, updateOption)
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
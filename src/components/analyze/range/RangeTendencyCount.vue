<script setup>
import { watch } from 'vue'
import { chartPalette } from '@/assets/js/palette'
import Chart from 'chart.js/auto'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'

const props = defineProps({
  canvasId: {
    type: String,
    required: true,
  },
  suffix: {
    type: String,
    required: true,
  },
  codeStep: {
    type: Number,
    required: true,
  },
  result: {
    type: Object,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

let chart = null

const isLoading = computed(() =>
  Object.keys(props.result).length ? false : true,
)

watch([() => props.result, () => props.codeStep], () => {
  renderChart()
})

function renderChart() {
  if (chart) {
    chart.destroy()
    chart = null
  }

  const suffix = props.suffix
  const result = props.result
  const { gridColor, tickColor, labelColor, chartLine } = chartPalette

  chart = new Chart(document.getElementById(props.canvasId), {
    type: 'line',
    data: {
      datasets: Object.entries(result).map(([key, data], index) => ({
        label: `${key} ${suffix}`,
        data: Object.entries(data)
          .reverse()
          .reduce((acc, [key, value]) => {
            acc[key] = value.times
            return acc
          }, {}),
        borderWidth: 1,
        borderColor: chartLine[index],
        backgroundColor: chartLine[index],
      })),
    },
    options: {
      indexAxis: 'x',
      scales: {
        x: {
          ticks: {
            color: tickColor,
          },
          grid: {
            color: gridColor,
          },
        },
        y: {
          ticks: {
            color: tickColor,
          },
          grid: {
            color: gridColor,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: labelColor,
          },
        },
      },
    },
  })
}
</script>

<template>
  <LoadingWrapper :is-loading="isLoading">
    <p>{{ description }}</p>
  </LoadingWrapper>
  <canvas :id="canvasId"></canvas>
</template>

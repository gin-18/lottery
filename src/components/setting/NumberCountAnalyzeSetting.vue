<script setup>
import { storeToRefs } from 'pinia'
import { useNumberAnalyzeStore } from '@/stores/number_analyze'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const numberAnalyzeStore = useNumberAnalyzeStore()
const {
  codeStep: numberCodeStep,
  startData: numberStartData,
  endData: numberEndData,
  startAddArrowStatus,
  startReduceArrowStatus,
  endAddArrowStatus,
  endReduceArrowStatus,
} = storeToRefs(numberAnalyzeStore)

function addNumberStartCode() {
  numberAnalyzeStore.addStartCode()
}
function reduceNumberStartCode() {
  numberAnalyzeStore.reduceStartCode(props.data)
}

function addNumberEndCode() {
  numberAnalyzeStore.addEndCode()
}
function reduceNumberEndCode() {
  numberAnalyzeStore.reduceEndCode()
}
</script>

<template>
  <div>
    <h3>号码统计</h3>
    <p>共 {{ numberCodeStep }} 期</p>
    <div>
      <div>
        <h4>起始期次：</h4>
        <div class="flex justify-between items-center">
          <button
            class="btn"
            :class="{ 'btn-disabled': startAddArrowStatus }"
            @click="reduceNumberStartCode"
          >
            <span class="icon-[octicon--triangle-left-24]"></span>
          </button>
          <CodeDate :data="numberStartData" />
          <button
            class="btn"
            :class="{ 'btn-disabled': startReduceArrowStatus }"
            @click="addNumberStartCode"
          >
            <span class="icon-[octicon--triangle-right-24]"></span>
          </button>
        </div>
      </div>

      <div>
        <h4>结束期次：</h4>
        <div class="flex justify-between items-center">
          <button
            class="btn"
            :class="{ 'btn-disabled': endAddArrowStatus }"
            @click="reduceNumberEndCode"
          >
            <span class="icon-[octicon--triangle-left-24]"></span>
          </button>
          <CodeDate :data="numberEndData" />
          <button
            class="btn"
            :class="{ 'btn-disabled': endReduceArrowStatus }"
            @click="addNumberEndCode"
          >
            <span class="icon-[octicon--triangle-right-24]"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

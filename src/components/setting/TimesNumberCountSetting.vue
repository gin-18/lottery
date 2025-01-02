<script setup>
import { storeToRefs } from 'pinia'
import { useTimesNumberCountStore } from '@/stores/times_number_count'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const timesNumberCountStore = useTimesNumberCountStore()
const {
  codeStep,
  startData,
  endData,
  startAddArrowStatus,
  startReduceArrowStatus,
  endAddArrowStatus,
  endReduceArrowStatus,
} = storeToRefs(timesNumberCountStore)

function addStartCode() {
  timesNumberCountStore.addStartCode()
}
function reduceStartCode() {
  timesNumberCountStore.reduceStartCode(props.data)
}

function addEndCode() {
  timesNumberCountStore.addEndCode()
}
function reduceEndCode() {
  timesNumberCountStore.reduceEndCode()
}
</script>

<template>
  <div>
    <h3>号码统计设置</h3>
    <p>共 {{ codeStep }} 期</p>
    <div>
      <div>
        <h4>起始期次：</h4>
        <div class="flex justify-between items-center">
          <button
            class="btn"
            :class="{ 'btn-disabled': startAddArrowStatus }"
            @click="reduceStartCode"
          >
            <span class="icon-[octicon--triangle-left-24]"></span>
          </button>
          <CodeDate :data="startData" />
          <button
            class="btn"
            :class="{ 'btn-disabled': startReduceArrowStatus }"
            @click="addStartCode"
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
            @click="reduceEndCode"
          >
            <span class="icon-[octicon--triangle-left-24]"></span>
          </button>
          <CodeDate :data="endData" />
          <button
            class="btn"
            :class="{ 'btn-disabled': endReduceArrowStatus }"
            @click="addEndCode"
          >
            <span class="icon-[octicon--triangle-right-24]"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

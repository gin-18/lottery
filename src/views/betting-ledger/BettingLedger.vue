<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BettingRecordFormDrawer from '@/views/betting-ledger/components/BettingRecordFormDrawer.vue'
import MonthlySummaryDrawer from '@/views/betting-ledger/components/MonthlySummaryDrawer.vue'
import RecordCardList from '@/views/betting-ledger/components/RecordCardList.vue'
import RecordDetailDrawer from '@/views/betting-ledger/components/RecordDetailDrawer.vue'
import { useBettingLedgerStore } from '@/stores/betting-ledger/betting-ledger'

const PAGE_SIZE = 8

const ledgerStore = useBettingLedgerStore()
const { sortedRecords, monthlyStats, recentDraws, error, notice } = storeToRefs(ledgerStore)

const editingRecord = ref(null)
const currentPage = ref(1)
const isSummaryDrawerOpen = ref(false)
const isFormDrawerOpen = ref(false)
const selectedDetailRecord = ref(null)
const isDetailDrawerOpen = ref(false)
const importInput = ref(null)
let toastTimer = null

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedRecords.value.length / PAGE_SIZE)),
)
const pagedRecords = computed(() => {
  const startIndex = (currentPage.value - 1) * PAGE_SIZE
  return sortedRecords.value.slice(startIndex, startIndex + PAGE_SIZE)
})
const paginationPages = computed(() => getPaginationPages())

watch(totalPages, syncCurrentPage)
watch([error, notice], clearToastLater)

onMounted(async () => {
  await ledgerStore.loadRecords()
  await ledgerStore.loadRecentDraws()
})

onUnmounted(() => {
  clearToastTimer()
})

async function handleSubmit(draft) {
  const savedRecord = editingRecord.value
    ? await ledgerStore.updateRecord(editingRecord.value, draft)
    : await ledgerStore.saveRecord(draft)

  if (!savedRecord) return

  closeFormDrawer()
  currentPage.value = 1
}

function openCreateDrawer() {
  editingRecord.value = null
  isFormDrawerOpen.value = true
}

function closeFormDrawer() {
  isFormDrawerOpen.value = false
  editingRecord.value = null
}

function handleFormDrawerChange(value) {
  if (value) {
    isFormDrawerOpen.value = true
    return
  }

  closeFormDrawer()
}

function startEdit(record) {
  editingRecord.value = record
  isFormDrawerOpen.value = true
}

function openDetailDrawer(record) {
  selectedDetailRecord.value = record
  isDetailDrawerOpen.value = true
}

function handleDetailDrawerChange(value) {
  isDetailDrawerOpen.value = value
  if (value) return

  selectedDetailRecord.value = null
}

function formatMoney(amount) {
  return Number(amount).toFixed(2)
}

function exportRecords() {
  const payload = {
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    records: sortedRecords.value,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `betting-ledger-${payload.exportedAt.slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function triggerImport() {
  importInput.value?.click()
}

async function handleImportChange(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  const result = await ledgerStore.importRecords(file)
  if (!result) return

  currentPage.value = 1
}

function syncCurrentPage() {
  if (currentPage.value <= totalPages.value) return
  currentPage.value = totalPages.value
}

function setCurrentPage(page) {
  currentPage.value = page
}

function getPaginationPages() {
  return Array.from({ length: totalPages.value }, (_, index) => index + 1)
}

function clearToastLater() {
  if (!error.value && !notice.value) return
  clearToastTimer()
  toastTimer = window.setTimeout(ledgerStore.clearMessages, 3000)
}

function clearToastTimer() {
  if (!toastTimer) return
  window.clearTimeout(toastTimer)
  toastTimer = null
}
</script>

<template>
  <section>
    <h2>投注记录</h2>
    <p>此功能只是本地数据存储，不提供投注服务！</p>
    <div class="grid gap-4">
      <div class="flex flex-wrap justify-end gap-2">
        <button class="btn btn-sm btn-primary" type="button" aria-label="导出" @click="exportRecords">
          <span class="icon-[octicon--download-16]"></span>
        </button>
        <button class="btn btn-sm btn-primary" type="button" aria-label="导入" @click="triggerImport">
          <span class="icon-[octicon--upload-16]"></span>
        </button>
        <button
          class="btn btn-sm btn-primary"
          type="button"
          aria-label="月份汇总"
          @click="isSummaryDrawerOpen = true"
        >
          <span class="icon-[octicon--graph-16]"></span>
        </button>
        <button class="btn btn-sm btn-primary" type="button" aria-label="新增" @click="openCreateDrawer">
          <span class="icon-[octicon--plus-16]"></span>
        </button>
      </div>
      <input
        ref="importInput"
        class="hidden"
        type="file"
        accept="application/json"
        @change="handleImportChange"
      >
    </div>
  </section>

  <div v-if="error || notice" class="toast toast-top toast-center z-50">
    <div v-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>
    <div v-if="notice" class="alert alert-success">
      <span>{{ notice }}</span>
    </div>
  </div>

  <section class="not-prose mt-4 pb-4 grid gap-4">
    <RecordCardList
      :records="pagedRecords"
      @view="openDetailDrawer"
      @edit="startEdit"
      @delete="ledgerStore.deleteRecord"
      @settle="ledgerStore.settleRecord"
    />

    <div v-if="sortedRecords.length" class="flex flex-wrap items-center justify-between gap-2">
      <div class="text-sm text-base-content/70">
        共 {{ sortedRecords.length }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
      </div>
      <div class="join">
        <button
          v-for="page in paginationPages"
          :key="page"
          class="btn join-item btn-sm"
          type="button"
          :class="{ 'btn-primary': page === currentPage }"
          @click="setCurrentPage(page)"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </section>

  <MonthlySummaryDrawer
    :is-open="isSummaryDrawerOpen"
    :monthly-stats="monthlyStats"
    @update:is-open="isSummaryDrawerOpen = $event"
  />

  <BettingRecordFormDrawer
    :is-open="isFormDrawerOpen"
    :editing-record="editingRecord"
    :recent-draws="recentDraws"
    @submit="handleSubmit"
    @update:is-open="handleFormDrawerChange"
  />

  <RecordDetailDrawer
    :record="selectedDetailRecord"
    :is-open="isDetailDrawerOpen"
    @update:is-open="handleDetailDrawerChange"
  />
</template>

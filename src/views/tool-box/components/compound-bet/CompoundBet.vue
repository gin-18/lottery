<script setup>
import { ref, watch, onMounted } from 'vue'
import SettingBox from '@/components/content/SettingBox.vue'

const bets = [
  '选一',
  '选二',
  '选三',
  '选四',
  '选五',
  '选六',
  '选七',
  '选八',
  '选九',
  '选十',
]

// 选中的玩法
const selectedBet = ref('选一')

// 可选的号码个数
const activedNumbers = ref([])

const startingNumber = ref(0)

// 投注的号码个数
const betNumber = ref(1)
// 投注数量
const betCount = ref(0)
// 投注金额
const betAmount = ref(0)
// 中奖注数
const winningBets = ref(0)

// 命中的号码个数
const hitNumber = ref(1)

// 设置相关变量
const isOpenSetting = ref(false)
const settingTitle = ref('选择投注个数')

// 选择玩法
function onSelectOptional(optional) {
  selectedBet.value = optional
}

// 检查玩法是否被选中
function checkBetIsSelected(bet) {
  return selectedBet.value === bet
}

// 展示可选号码个数
function showActivedNumbers(title, starting, total) {
  const numbers = genOptionalNumber(starting, total)
  activedNumbers.value = numbers
  settingTitle.value = title
  isOpenSetting.value = true
}

// 设置默认选中号码个数
function setDefaultActivedNumber(number, title) {
  if (title === '选择投注个数') {
    return betNumber.value === number
  }

  if (title === '选择命中个数') {
    return hitNumber.value === number
  }

  return false
}

function selectActivedNumber(number, title) {
  if (title === '选择投注个数') {
    betNumber.value = number
  }

  if (title === '选择命中个数') {
    hitNumber.value = number
  }

  isOpenSetting.value = false
}

// 生成可选号码个数
function genOptionalNumber(starting, total = 80) {
  const numbers = Array.from({ length: total }, (_, index) => index + 1)
  return numbers.slice(starting, numbers.length + 1)
}

// 组合数计算函数
function comb(n, k) {
  if (k < 0 || k > n) return 0
  if (k === 0 || k === n) return 1

  k = Math.min(k, n - k)
  let result = 1
  for (let i = 1; i <= k; i++) {
    result = (result * (n - i + 1)) / i
  }
  return Math.round(result)
}

function calculateBonus(k, n, m) {
  // 定义各玩法的奖金规则（匹配号码数: 奖金）
  const prizeTables = {
    1: { 1: 4.6 },
    2: { 2: 19 },
    3: { 2: 3, 3: 53 },
    4: { 2: 2, 3: 5, 4: 100 },
    5: { 3: 3, 4: 21, 5: 1000 },
    6: { 3: 5, 4: 30, 5: 200, 6: 5000 },
    7: { 4: 4, 5: 20, 6: 200, 7: 10000 },
    8: { 5: 5, 6: 50, 7: 1000, 8: 100000 },
    9: { 5: 5, 6: 30, 7: 300, 8: 10000, 9: 300000 },
    10: { 5: 5, 6: 50, 7: 1000, 8: 50000, 9: 1000000, 10: 5000000 },
  }

  // 计算投注数量和金额
  const totalBets = comb(n, k)
  const totalCost = totalBets * 2 // 每注2元

  // 计算中奖金额和明细
  let totalBonus = 0
  let winningBets = 0
  const prizeDetails = []
  const prizeRules = prizeTables[k]

  for (const [t, prize] of Object.entries(prizeRules)) {
    const tInt = parseInt(t)
    if (tInt <= m && k - tInt <= n - m) {
      const betsForThisPrize = comb(m, tInt) * comb(n - m, k - tInt)
      const prizeTotal = betsForThisPrize * prize

      totalBonus += prizeTotal
      winningBets += betsForThisPrize

      prizeDetails.push({
        level: `中${t}个`,
        condition: `选择${t}个中奖号码 + ${k - tInt}个未中号码`,
        prizePerBet: prize,
        bets: betsForThisPrize,
        total: prizeTotal,
      })
    }
  }

  // 计算本金和盈亏
  const profit = totalBonus - totalCost
  const roi = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : 0

  // 返回结果
  return {
    betCount: totalBets,
    betAmount: totalCost,
    winningBets: winningBets,
    bonus: Math.round(totalBonus * 10) / 10, // 保留1位小数
    prizeDetails: prizeDetails,
    profit: Math.round(profit * 10) / 10,
    roi: roi,
  }
}

onMounted(() => {
  // 默认选中选一玩法
  onSelectOptional(bets[0])
  // 计算结果
  const betIndex = bets.findIndex((bet) => bet === selectedBet.value) + 1
  console.log(betIndex)
  calculateBonus(betIndex)
})

watch(selectedBet, (val) => {
  startingNumber.value = bets.findIndex((bet) => bet === val)
  betNumber.value = genOptionalNumber(startingNumber.value)[0]
  hitNumber.value = genOptionalNumber(0, betNumber.value)[0]
})
</script>

<template>
  <section>
    <div>
      <p class="text-base font-semibold">玩法</p>
      <div class="grid grid-cols-5 gap-2">
        <button
          :class="{
            'btn btn-sm': true,
            'btn-primary': checkBetIsSelected(bet),
          }"
          v-for="bet in bets"
          :key="bet"
          @click="onSelectOptional(bet)"
        >
          {{ bet }}
        </button>
      </div>
    </div>

    <div class="flex justify-between">
      <div>
        <p class="text-base font-semibold">投注个数</p>
        <div>
          <button
            class="btn btn-sm flex justify-between items-center gap-6"
            @click="showActivedNumbers('选择投注个数', startingNumber, 80)"
          >
            <span>{{ betNumber }} 个</span>
            <span class="icon-[octicon--chevron-down-12]"></span>
          </button>
        </div>
      </div>
      <div>
        <p class="text-base font-semibold">命中个数</p>
        <div>
          <button
            class="btn btn-sm flex justify-between items-center gap-6"
            @click="showActivedNumbers('选择命中个数', 0, betNumber)"
          >
            <span>{{ hitNumber }} 个</span>
            <span class="icon-[octicon--chevron-down-12]"></span>
          </button>
        </div>
      </div>
    </div>

    <div>
      <p class="text-base font-semibold">获奖情况</p>
      <p>玩法 {{ selectedBet }}</p>
      <p>投注个数 {{ betNumber }}</p>
      <p>命中个数 {{ hitNumber }}</p>
    </div>
  </section>

  <SettingBox
    v-model:show="isOpenSetting"
    is-custom-toggle
    :title="settingTitle"
  >
    <section>
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="number in activedNumbers"
          :key="number"
          :class="{
            'btn btn-sm': true,
            'btn-primary': setDefaultActivedNumber(number, settingTitle),
          }"
          @click="selectActivedNumber(number, settingTitle)"
        >
          {{ number }}
        </button>
      </div>
    </section>
  </SettingBox>
</template>

<template>
  <v-col
    cols="12"
    sm="4"
    md="3"
    class="history-column"
    v-if="!isMobile || showHistory"
  >
    <v-card elevation="2">
      <v-card-title class="text-h6 d-flex align-center justify-space-between">
        Submission History
        <v-btn v-if="isMobile" icon size="small" @click="showHistory = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div v-if="!history || history.length === 0" class="text-grey">No submissions yet.</div>
        <div v-else>
          <v-list class="history-list" density="compact">
            <v-list-item
              v-for="item in history"
              :key="item.submissionId"
              :class="{ 'selected-item': selectedId === item.submissionId }"
              @click="selectItem(item)"
              clickable
            >
              <v-list-item-title>
                {{ formatHistory(item) }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
  <v-btn
    v-if="isMobile && !showHistory"
    class="show-history-btn"
    color="primary"
    icon
    @click="showHistory = true"
    style="position: fixed; bottom: 24px; right: 24px; z-index: 1000;"
  >
    <v-icon>mdi-history</v-icon>
  </v-btn>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])
const selectedId = ref(null)
const isMobile = ref(false)
const showHistory = ref(true)

function formatHistory(item) {
  return `${item.date} - ${item.correctAnswersPercentage}%`
}

function selectItem(item) {
  selectedId.value = item.submissionId
  emit('select', item)
}

function handleResize() {
  isMobile.value = window.innerWidth < 700
  if (!isMobile.value) showHistory.value = true
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.history-column {
  min-width: 220px;
  max-width: 350px;
  margin-top: 24px;
}
@media (max-width: 960px) {
  .history-column {
    max-width: 100%;
    min-width: 0;
    margin-top: 16px;
  }
}
.history-list {
  max-height: 340px;
  overflow-y: auto;
  border-radius: 4px;
  background: #fafafa;
}
.selected-item {
  background-color: #e3f2fd !important;
  font-weight: 600;
  color: #1976d2;
}
.show-history-btn {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
</style> 
<template>
  <v-dialog v-model="open" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Session Details</span>
        <v-btn icon @click="emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div v-if="session">
          <div class="mb-4">
            <div><strong>Date:</strong> {{ session.date }}</div>
            <div v-if="session.percentCorrect !== undefined">
              <v-chip color="primary" class="ma-2">
                Score: {{ session.percentCorrect }}%
              </v-chip>
            </div>
            <div v-if="session.parameters">
              <div class="mt-2"><strong>Parameters:</strong></div>
              <ul>
                <li><strong>Additions:</strong> {{ session.parameters.add }}</li>
                <li><strong>Subtractions:</strong> {{ session.parameters.sub }}</li>
                <li><strong>Max Number:</strong> {{ session.parameters.max }}</li>
              </ul>
            </div>
          </div>
          <v-divider class="mb-2" />
          <div>
            <strong>Problems & Answers:</strong>
            <v-list>
              <v-list-item v-for="(problem, idx) in session.problems" :key="idx">
                <v-list-item-title>
                  {{ problem.left }} {{ problem.operator }} {{ problem.right }} =
                  <span
                    :class="{
                      'text-success': isCorrect(problem),
                      'text-error': !isCorrect(problem)
                    }"
                  >
                    {{ problem.answer }}
                  </span>
                  <v-icon
                    :color="isCorrect(problem) ? 'success' : 'error'"
                    class="ml-2"
                  >
                    {{ isCorrect(problem) ? 'mdi-check-circle' : 'mdi-close-circle' }}
                  </v-icon>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  session: { type: Object, required: true },
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const open = ref(props.modelValue)
watch(() => props.modelValue, val => { open.value = val })
watch(open, val => { if (!val) emit('close') })

function isCorrect(problem) {
  if (problem.operator === '+') return problem.answer === problem.left + problem.right
  if (problem.operator === '-') return problem.answer === problem.left - problem.right
  return false
}
</script>

<style scoped>
.v-card-title {
  font-size: 1.2em;
}
</style> 
<script setup>
import { ref, computed } from 'vue'
import { generateProblemsWithGemini } from '../services/geminiService.js'
import { getSelectedGeminiModel } from '../services/cookieStorage.js'
import { homeworkService } from '../services/supabase.js'

const sessionStarted = ref(false)
const sessionComplete = ref(false)
const problems = ref([])
const submitting = ref(false)
const showConfirmation = ref(false)
const showConfirmDialog = ref(false)
const loadingProblems = ref(false)
const error = ref(null)

async function getParameters() {
  try {
    return await homeworkService.getParameters()
  } catch (e) {
    console.error('Error fetching parameters:', e)
    error.value = 'Failed to load parameters. Using defaults.'
    return {
      add: 4,
      sub: 3,
      max: 20,
      age: 8
    }
  }
}

async function startHomework() {
  console.log("button clicked")
  loadingProblems.value = true
  error.value = null
  
  try {
    const params = await getParameters()
    const model = getSelectedGeminiModel() || 'gemini-2.0-flash'
    
    // Generate problems using Gemini AI
    const aiMathProblems = await generateProblemsWithGemini(params, model)
    
    if (!Array.isArray(aiMathProblems) || aiMathProblems.length === 0) {
      throw new Error('Failed to generate problems. Please try again.')
    }
    
    problems.value = aiMathProblems
    sessionStarted.value = true
    sessionComplete.value = false
    showConfirmation.value = false
  } catch (e) {
    error.value = 'Failed to start homework session. Please try again.'
    console.error('Error starting homework:', e)
  } finally {
    loadingProblems.value = false
  }
}

function isCorrect(problem) {
  // Convert answer to number to ensure consistent type comparison
  const studentAnswer = Number(problem.answer)
  
  // Check if answer is a valid number
  if (isNaN(studentAnswer)) return false
  
  if (problem.operator === '+') {
    return studentAnswer === (problem.left + problem.right)
  }
  if (problem.operator === '-') {
    return studentAnswer === (problem.left - problem.right)
  }
  return false
}

const correctCount = computed(() =>
  problems.value.filter(isCorrect).length
)
const totalCount = computed(() => problems.value.length)
const percentCorrect = computed(() =>
  totalCount.value ? Math.round((correctCount.value / totalCount.value) * 100) : 0
)

const allAnswered = computed(() =>
  problems.value.length > 0 && problems.value.every(p => p.answer !== null && p.answer !== undefined && p.answer !== '')
)

async function submitHomework() {
  if (!allAnswered.value) return
  submitting.value = true
  error.value = null
  
  try {
    const params = await getParameters()
    const session = {
      problems: JSON.parse(JSON.stringify(problems.value)),
      parameters: params,
      percentCorrect: percentCorrect.value
    }
    
    await homeworkService.saveHomeworkSession(session)
    sessionComplete.value = true
    showConfirmation.value = true
  } catch (e) {
    error.value = 'Failed to save homework session. Please try again.'
    console.error('Error submitting homework:', e)
  } finally {
    submitting.value = false
  }
}

const additionProblems = computed(() => problems.value.filter(p => p.operator === '+'))
const subtractionProblems = computed(() => problems.value.filter(p => p.operator === '-'))

function trySubmitHomework() {
  if (!allAnswered.value) return
  showConfirmDialog.value = true
}

function confirmSubmitHomework() {
  showConfirmDialog.value = false
  submitHomework()
}

function cancelSubmitHomework() {
  showConfirmDialog.value = false
}
</script>

<template>
  <v-container fluid>
    <v-container>
      <v-alert
        v-if="error"
        type="error"
        class="mb-4"
        closable
        @click:close="error = null"
      >
        {{ error }}
      </v-alert>
      
      <div v-if="!sessionStarted">
        <v-row justify="center" class="mt-10">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <h2>Welcome to Your Homework!</h2>
            <v-btn color="primary" size="large" @click="startHomework" :loading="loadingProblems">
              Start Your Homework
            </v-btn>
            <v-progress-circular v-if="loadingProblems" indeterminate color="primary" class="mt-4" />
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <h3 v-if="!sessionComplete">Let's solve some math problems!</h3>
        <h3 v-else>Your Results</h3>
        <div v-if="sessionComplete">
          <v-chip color="primary" class="ma-2">
            Score: {{ correctCount }} / {{ totalCount }} ({{ percentCorrect }}%)
          </v-chip>
          <v-alert type="success" class="mt-4" v-if="showConfirmation">
            Homework submitted! Great job!
          </v-alert>
        </div>
        <p v-if="!sessionComplete" class="mb-2">
          <v-chip color="info" class="ma-2">
            Problems: {{ problems.filter(p => p.answer !== null && p.answer !== undefined && p.answer !== '').length }} / {{ totalCount }} answered
          </v-chip>
        </p>
        <v-row>
          <v-col cols="12" md="6">
            <h4>Additions</h4>
            <v-list>
              <v-list-item v-for="(problem, idx) in additionProblems" :key="`add-${idx}`">
                <div class="d-flex align-center">
                  <v-list-item-title>
                    {{ problem.left }} + {{ problem.right }} =
                    <template v-if="sessionComplete">
                      <span :class="{
                        'text-success': isCorrect(problem),
                        'text-error': !isCorrect(problem)
                      }">
                        {{ problem.answer }}
                      </span>
                      <v-icon
                        :color="isCorrect(problem) ? 'success' : 'error'"
                        class="ml-2"
                      >
                        {{ isCorrect(problem) ? 'mdi-check-circle' : 'mdi-close-circle' }}
                      </v-icon>
                    </template>
                  </v-list-item-title>
                  <v-text-field
                    v-if="!sessionComplete"
                    v-model.number="problem.answer"
                    type="number"
                    density="compact"
                    hide-details
                    style="max-width: 70px; margin-left: 12px;"
                    :aria-label="`Answer for addition problem ${idx + 1}`"
                  />
                </div>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="6">
            <h4>Subtractions</h4>
            <v-list>
              <v-list-item v-for="(problem, idx) in subtractionProblems" :key="`sub-${idx}`">
                <div class="d-flex align-center">
                  <v-list-item-title>
                    {{ problem.left }} - {{ problem.right }} =
                    <template v-if="sessionComplete">
                      <span :class="{
                        'text-success': isCorrect(problem),
                        'text-error': !isCorrect(problem)
                      }">
                        {{ problem.answer }}
                      </span>
                      <v-icon
                        :color="isCorrect(problem) ? 'success' : 'error'"
                        class="ml-2"
                      >
                        {{ isCorrect(problem) ? 'mdi-check-circle' : 'mdi-close-circle' }}
                      </v-icon>
                    </template>
                  </v-list-item-title>
                  <v-text-field
                    v-if="!sessionComplete"
                    v-model.number="problem.answer"
                    type="number"
                    density="compact"
                    hide-details
                    style="max-width: 70px; margin-left: 12px;"
                    :aria-label="`Answer for subtraction problem ${idx + 1}`"
                  />
                </div>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
        <v-btn
          v-if="!sessionComplete"
          color="success"
          class="mt-4"
          :loading="submitting"
          :disabled="!allAnswered || submitting"
          @click="trySubmitHomework"
        >
          Submit Homework
        </v-btn>
        <v-dialog v-model="showConfirmDialog" max-width="400">
          <v-card>
            <v-card-title class="text-h6">Are you sure you want to submit?</v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="confirmSubmitHomework">Yes</v-btn>
              <v-btn color="secondary" @click="cancelSubmitHomework">No</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-container>
  </v-container>
</template> 
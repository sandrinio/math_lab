<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-simple-table class="mt-5 parameter-table">
          <thead>
            <tr>
              <th class="text-left">Parameter</th>
              <th class="text-left">Value</th>
              <th class="text-left">Help</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="param in parameters" :key="param.key">
              <td>{{ param.label }}</td>
              <td>
                <template v-if="param.key === 'age'">
                  <v-select
                    v-model="form.age"
                    :items="ageOptions"
                    label="Select Age"
                    dense
                    hide-details
                  />
                </template>
                <template v-else>
                  <v-text-field
                    v-model.number="form[param.key]"
                    type="number"
                    :label="param.label"
                    :min="1"
                    :step="1"
                    dense
                    hide-details
                  />
                </template>
              </td>
              <td>
                <v-tooltip location="top">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" small color="primary" class="mr-1">mdi-information</v-icon>
                  </template>
                  <span>{{ param.help }}</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-row justify="end" class="mt-4">
          <v-btn color="primary" @click="saveParameters">Save Parameters</v-btn>
        </v-row>
        <v-snackbar v-model="snackbar" color="success" timeout="2000">
          Parameters saved!
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

const parameters = [
  { key: 'age', label: 'Age', help: 'Select the age group for the student.' },
  { key: 'logical', label: 'Number of Logical Problems', help: 'Set how many logic problems to generate.' },
  { key: 'add', label: 'Number of Additions', help: 'Set how many addition problems to generate.' },
  { key: 'sub', label: 'Number of Subtractions', help: 'Set how many subtraction problems to generate.' },
  { key: 'max', label: 'Max Number for Math Problems', help: 'Set the maximum number used in math problems.' },
]

const ageOptions = [6, 7, 8, 9, 10, 11, 12]

const form = reactive({
  age: null,
  logical: 1,
  add: 1,
  sub: 1,
  max: 10,
})

const snackbar = ref(false)

function saveParameters() {
  try {
    localStorage.setItem('mathLabParameters', JSON.stringify(form))
    snackbar.value = true
  } catch (e) {
    alert('Failed to save parameters: ' + e.message)
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('mathLabParameters')
    if (saved) {
      const parsed = JSON.parse(saved)
      Object.keys(form).forEach(key => {
        if (parsed[key] !== undefined) form[key] = parsed[key]
      })
    }
  } catch (e) {
    // Ignore load errors
  }
})
</script>

<style scoped>
.parameter-table {
  background: #fff;
  word-break: break-word;
}
@media (max-width: 600px) {
  .parameter-table th,
  .parameter-table td {
    font-size: 0.95em;
    padding: 6px 4px;
  }
  .parameter-table {
    font-size: 0.95em;
  }
}
</style> 
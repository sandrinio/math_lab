<template>
  <div class="admin-panel">
    <h1 class="text-h4 mb-6">Admin Panel</h1>
    
    <v-row>
      <!-- Parameters Section -->
      <v-col cols="12" md="4">
        <v-card title="Parameters" variant="tonal" class="mb-4">
          <v-card-text>
            <!-- Success Alert -->
            <v-alert
              v-if="saveSuccess"
              type="success"
              variant="tonal"
              closable
              class="mb-4"
            >
              Parameters saved successfully
            </v-alert>

            <!-- Error Alert -->
            <v-alert
              v-if="saveError"
              type="error"
              variant="tonal"
              closable
              class="mb-4"
            >
              {{ saveError }}
            </v-alert>

            <v-form @submit.prevent="saveParameters" ref="form">
              <v-text-field
                v-model="parameters.age"
                label="Age Range"
                type="number"
                variant="outlined"
                class="mb-2"
              ></v-text-field>
              
              <v-text-field
                v-model="parameters.add"
                label="Number of Additions"
                type="number"
                variant="outlined"
                class="mb-2"
              ></v-text-field>
              
              <v-text-field
                v-model="parameters.sub"
                label="Number of Subtractions"
                type="number"
                variant="outlined"
                class="mb-2"
              ></v-text-field>
              
              <v-text-field
                v-model="parameters.max"
                label="Maximum Number"
                type="number"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              
              <v-btn
                color="primary"
                type="submit"
                block
                :loading="savingParameters"
              >
                Save Parameters
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- History Section -->
      <v-col cols="12" md="8">
        <v-card title="Homework History" variant="tonal">
          <v-card-text>
            <!-- Controls -->
            <div class="d-flex justify-space-between align-center mb-4">
              <div class="text-subtitle-1">
                Total Submissions: {{ totalItems }}
              </div>
              <v-btn
                @click="loadHistory"
                :loading="loading"
                variant="outlined"
                prepend-icon="mdi-refresh"
              >
                Refresh
              </v-btn>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="d-flex justify-center">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>

            <!-- Error State -->
            <v-alert
              v-else-if="error"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ error.message }}
              <template v-slot:append>
                <v-btn
                  @click="loadHistory"
                  color="error"
                  variant="text"
                >
                  Retry
                </v-btn>
              </template>
            </v-alert>

            <!-- Data Display -->
            <div v-else>
              <v-list lines="two" class="mb-4">
                <v-list-subheader>
                  <div class="d-flex justify-space-between align-center w-100">
                    <div class="cursor-pointer" @click="updateSort('submission_date')">
                      Date {{ getSortIcon('submission_date') }}
                    </div>
                    <div class="cursor-pointer" @click="updateSort('percent_correct')">
                      Score {{ getSortIcon('percent_correct') }}
                    </div>
                  </div>
                </v-list-subheader>

                <v-list-item
                  v-for="submission in submissions"
                  :key="submission.id"
                  :subtitle="formatDate(submission.date)"
                >
                  <template v-slot:prepend>
                    <v-chip
                      :color="getScoreColor(submission.percentCorrect)"
                      variant="tonal"
                      class="mr-2"
                    >
                      {{ submission.percentCorrect }}%
                    </v-chip>
                  </template>

                  <template v-slot:append>
                    <v-btn
                      variant="text"
                      density="comfortable"
                      @click="showProblems(submission)"
                      class="mr-2"
                    >
                      Problems
                    </v-btn>
                    <v-btn
                      variant="text"
                      density="comfortable"
                      @click="showParameters(submission)"
                    >
                      Parameters
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>

              <!-- Pagination -->
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                @update:model-value="changePage"
                class="mt-4"
              ></v-pagination>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal for viewing details -->
    <v-dialog v-model="showModal" max-width="600px">
      <v-card>
        <v-card-title>{{ modalTitle }}</v-card-title>
        <v-card-text>
          <template v-if="modalTitle === 'Problems'">
            <v-expansion-panels>
              <v-expansion-panel
                v-for="(problem, index) in modalData"
                :key="index"
              >
                <v-expansion-panel-title>
                  Problem {{ index + 1 }}
                  <template v-slot:actions>
                    <v-icon
                      :color="problem.isCorrect ? 'success' : 'error'"
                    >
                      {{ problem.isCorrect ? 'mdi-check' : 'mdi-close' }}
                    </v-icon>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="mb-2">Question: {{ problem.question }}</div>
                  <div class="mb-2">Correct Answer: {{ problem.correctAnswer }}</div>
                  <div>Student Answer: {{ problem.studentAnswer }}</div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
          <template v-else>
            <v-list>
              <v-list-item>
                <v-list-item-title>Age Range</v-list-item-title>
                <v-list-item-subtitle>{{ modalData.age_range }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Additions</v-list-item-title>
                <v-list-item-subtitle>{{ modalData.additions_count }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Subtractions</v-list-item-title>
                <v-list-item-subtitle>{{ modalData.subtractions_count }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Max Number</v-list-item-title>
                <v-list-item-subtitle>{{ modalData.max_number }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="closeModal"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { fetchHomeworkHistory, homeworkService } from '../services/supabase';
import { setSessionCookie, getSessionCookie } from '../services/cookieStorage';

export default {
  name: 'AdminPanel',
  
  setup() {
    // State
    const submissions = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const currentPage = ref(1);
    const totalItems = ref(0);
    const pageSize = 10;

    // Parameters state
    const parameters = ref({
      age: '',
      add: '',
      sub: '',
      max: ''
    });
    const savingParameters = ref(false);
    const saveSuccess = ref(false);
    const saveError = ref(null);
    const form = ref(null);

    // Modal state
    const showModal = ref(false);
    const modalTitle = ref('');
    const modalData = ref(null);

    // Sorting state
    const sortBy = ref('submission_date');
    const sortOrder = ref('desc');

    // Computed
    const totalPages = computed(() => 
      Math.ceil(totalItems.value / pageSize)
    );

    // Methods
    const loadHistory = async () => {
      loading.value = true;
      error.value = null;

      const { data, count, error: fetchError } = await fetchHomeworkHistory({
        page: currentPage.value,
        pageSize,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value
      });

      if (fetchError) {
        error.value = fetchError;
      } else {
        submissions.value = data;
        totalItems.value = count;
      }

      loading.value = false;
    };

    const loadParameters = async () => {
      try {
        // Load from Supabase
        const params = await homeworkService.getParameters();
        if (params) {
          parameters.value = {
            age: params.age?.toString() || '',
            add: params.add?.toString() || '',
            sub: params.sub?.toString() || '',
            max: params.max?.toString() || ''
          };
          // Update cookies with latest values from Supabase
          setSessionCookie(parameters.value, 'mathLabParameters', 30);
          return;
        }

        // Fallback to cookies if Supabase fails
        const cookieParams = getSessionCookie('mathLabParameters');
        if (cookieParams) {
          parameters.value = cookieParams;
        }
      } catch (err) {
        console.error('Error loading parameters:', err);
        saveError.value = 'Failed to load parameters. Using default values.';
        clearAlerts();
        
        // Set default values if both Supabase and cookies fail
        parameters.value = {
          age: '8',
          add: '4',
          sub: '3',
          max: '20'
        };
      }
    };

    const clearAlerts = () => {
      setTimeout(() => {
        saveSuccess.value = false;
        saveError.value = null;
      }, 5000);
    };

    const saveParameters = async () => {
      try {
        savingParameters.value = true;
        saveSuccess.value = false;
        saveError.value = null;

        // Validate inputs
        if (!parameters.value.age || !parameters.value.add || 
            !parameters.value.sub || !parameters.value.max) {
          throw new Error('All fields are required');
        }

        // Validate numeric values
        if (parseInt(parameters.value.age) <= 0 || 
            parseInt(parameters.value.add) <= 0 ||
            parseInt(parameters.value.sub) <= 0 || 
            parseInt(parameters.value.max) <= 0) {
          throw new Error('All values must be greater than 0');
        }

        // Save to cookies first
        setSessionCookie(parameters.value, 'mathLabParameters', 30); // Store for 30 days

        // Save to Supabase
        await homeworkService.saveParameters(parameters.value);
        
        // Show success message
        saveSuccess.value = true;
        clearAlerts();
      } catch (err) {
        console.error('Error saving parameters:', err);
        saveError.value = err.message || 'Failed to save parameters. Please try again.';
        clearAlerts();
      } finally {
        savingParameters.value = false;
      }
    };

    const changePage = (newPage) => {
      currentPage.value = newPage;
      loadHistory();
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleString();
    };

    const showProblems = (submission) => {
      modalTitle.value = 'Problems';
      modalData.value = submission.problems;
      showModal.value = true;
    };

    const showParameters = (submission) => {
      modalTitle.value = 'Parameters';
      modalData.value = submission.parameters;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      modalData.value = null;
    };

    const updateSort = (column) => {
      if (sortBy.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy.value = column;
        sortOrder.value = 'desc';
      }
      loadHistory();
    };

    const getSortIcon = (column) => {
      if (sortBy.value !== column) return '↕';
      return sortOrder.value === 'asc' ? '↑' : '↓';
    };

    const getScoreColor = (score) => {
      if (score >= 90) return 'success';
      if (score >= 70) return 'info';
      if (score >= 50) return 'warning';
      return 'error';
    };

    // Lifecycle
    onMounted(() => {
      loadHistory();
      loadParameters();
    });

    return {
      submissions,
      loading,
      error,
      currentPage,
      totalPages,
      showModal,
      modalTitle,
      modalData,
      parameters,
      savingParameters,
      saveSuccess,
      saveError,
      form,
      formatDate,
      loadHistory,
      saveParameters,
      changePage,
      showProblems,
      showParameters,
      closeModal,
      sortBy,
      sortOrder,
      updateSort,
      getSortIcon,
      getScoreColor,
      totalItems
    };
  }
};
</script>

<style scoped>
.admin-panel {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.cursor-pointer {
  cursor: pointer;
}

.w-100 {
  width: 100%;
}
</style>

<template>
  <div class="login-container">
    <v-card class="login-card" variant="outlined">
      <v-card-title class="text-center text-h5 font-weight-bold mb-4">
        Math Lab Login
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleLogin" ref="form">
          <v-text-field
            v-model="credentials.identifier"
            label="Email or Username"
            :rules="[v => !!v || 'Email or Username is required']"
            variant="outlined"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="credentials.password"
            label="Password"
            :rules="[v => !!v || 'Password is required']"
            variant="outlined"
            type="password"
            class="mb-6"
          ></v-text-field>

          <v-alert
            v-if="error"
            type="error"
            class="mb-4"
            closable
          >
            {{ error }}
          </v-alert>

          <v-btn
            type="submit"
            color="primary"
            block
            :loading="loading"
            size="large"
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const store = useStore()
    const form = ref(null)
    
    const loading = computed(() => store.getters['user/isLoading'])
    const error = computed(() => store.getters['user/error'])
    const credentials = ref({
      identifier: '',
      password: ''
    })

    const handleLogin = async () => {
      if (!form.value.validate()) return

      const { success, userType, error: loginError } = await store.dispatch('user/login', {
        identifier: credentials.value.identifier,
        password: credentials.value.password
      })

      if (success) {
        // Redirect based on user type
        router.push(userType === 'child' ? '/homework' : '/admin')
      }
    }

    return {
      form,
      loading,
      error,
      credentials,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 16px;
}
</style> 
<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const isAuthenticated = computed(() => store.getters['user/isAuthenticated'])
const isParentOrAdmin = computed(() => 
  store.getters['user/isParent'] || store.getters['user/isAdmin']
)
const userName = computed(() => store.getters['user/userName'])

const handleLogout = async () => {
  const { success } = await store.dispatch('user/logout')
  if (success) {
    router.push('/login')
  }
}

onMounted(() => {
  store.dispatch('user/initializeAuth')
})
</script>

<template>
  <v-app>
    <!-- Navigation bar -->
    <v-app-bar v-if="isAuthenticated" color="primary">
      <v-app-bar-title>Math Lab</v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Navigation buttons -->
      <v-btn
        v-if="isParentOrAdmin"
        :to="'/admin'"
        text
      >
        Admin Panel
      </v-btn>
      
      <v-btn
        :to="'/homework'"
        text
      >
        Homework
      </v-btn>

      <!-- User name display -->
      <v-btn
        text
        disabled
        class="ml-2"
      >
        {{ userName }}
      </v-btn>

      <!-- Logout button -->
      <v-btn
        icon
        class="ml-2"
        @click="handleLogout"
        title="Logout"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
.v-app-bar {
  .v-btn {
    margin-left: 8px;
  }
}
</style>

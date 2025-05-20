// Predefined users
const users = {
  sandrinio: {
    username: 'sandrinio',
    password: '1234321',
    name: 'Sandrinio',
    type: 'admin',
    user_type: 'admin'
  },
  iva: {
    username: 'iva',
    password: '2017',
    name: 'Iva',
    type: 'child',
    user_type: 'child'
  }
}

// Simulated authentication service
export const authService = {
  login(username, password) {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const user = users[username]
        if (user && user.password === password) {
          // Store user in session storage with both type fields
          sessionStorage.setItem('user', JSON.stringify(user))
          resolve({ success: true, user })
        } else {
          resolve({ success: false, error: 'Invalid username or password' })
        }
      }, 300)
    })
  },

  logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        sessionStorage.removeItem('user')
        resolve({ success: true })
      }, 300)
    })
  },

  getCurrentUser() {
    const userStr = sessionStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAdmin(user) {
    return user?.type === 'admin' || user?.user_type === 'admin'
  }
} 
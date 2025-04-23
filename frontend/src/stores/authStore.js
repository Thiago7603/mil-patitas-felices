import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  actions: {
    login(userData) {
      this.user = userData
      localStorage.setItem('user', JSON.stringify(userData))
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    loadUser() {
      const saved = localStorage.getItem('user')
      if (saved) {
        this.user = JSON.parse(saved)
      }
    }
  }
})

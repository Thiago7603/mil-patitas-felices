import { ref } from 'vue'

export const user = ref(null)

export function setUser(userData) {
  user.value = userData
  localStorage.setItem('user', JSON.stringify(userData))
}

export function loadUserFromStorage() {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
}

export function logoutUser() {
  user.value = null
  localStorage.removeItem('user')
}
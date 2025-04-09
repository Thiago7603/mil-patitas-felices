<template>
  <div id="app">
    <Register />
    <Login />
  </div>
</template>

<script>
import Register from './components/Register.vue'
import Login from './components/Login.vue'

export default {
  components: {
    Register,
    Login
  }
}
</script>

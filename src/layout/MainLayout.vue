<!-- src/layouts/MainLayout.vue -->
<template>
    <div>
      <NavBar />
      <router-view />
      <Footer />
    </div>
  </template>
  
  <script>
  import NavBar from '../components/navbars/NavBar.vue';
  import Footer from '../components/Footer.vue';
  
  export default {
    components: {
      NavBar,
      Footer,
    },
  };
  </script>
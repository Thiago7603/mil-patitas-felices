<template>
  <footer class="footer">
    <div class="container">
      <p>Copyright © 2025 by <span>Mil Patitas Felices</span> || All Right Reservd.</p>
    </div>
  </footer>
</template>
    
<script>
  export default {
    name: 'Footer',
  };
</script>
    
<style scoped>
  .footer {
    background: #2c3e50;
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    color: white;
  }
</style>
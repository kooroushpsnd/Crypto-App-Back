<template>
  <HeaderPart />
  <MainPart />
</template>

<script>
import HeaderPart from './components/HeaderPart.vue';
import MainPart from './components/MainPart.vue';


export default {
  name: 'App',
  components: {HeaderPart ,MainPart}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background: rgb(224, 199, 151);
}
</style>

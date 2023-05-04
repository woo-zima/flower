<template>
  <div id="main">
    <el-container class="page-container" style="overflow: hidden">
      <el-header>
        <HeaderBar />
      </el-header>
      <el-main>
        <!-- vue-page-stack  -->
        <router-view :key="route.fullPath"></router-view>
      </el-main>
    </el-container>
    <Enter></Enter>
  </div>
</template>

<script setup>
import Enter from '@/components/Enter/index.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<style>
#main {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* color: #2c3e50; */
}
body {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}

a {
  text-decoration: none;
}
.el-main {
  --el-main-padding: 0;
  height: calc(100vh - 60px);
  /* overflow: hidden; */
}
.el-header {
  padding: 0;
}
.el-button {
  background-color: #fff;
  border: 1px solid;
  color: #e06666;
}
</style>

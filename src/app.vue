<template>
  <div id="main">
    <!-- <Map></Map> -->
    <!-- <MapInput></MapInput> -->
    <!-- <Photo /> -->
    <el-container class="page-container" style="overflow: hidden">
      <el-header>
        <HeaderBar />
      </el-header>
      <el-main>
        <!-- vue-page-stack  -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import Map from '@/components/Map.vue';
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
  overflow-y: hidden;
}
.el-header {
  padding: 0;
}
</style>

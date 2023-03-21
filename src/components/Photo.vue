<template>
  <div class="setPhotoSize">
    <el-carousel direction="vertical" :autoplay="false">
      <el-carousel-item v-for="item in imgArr" :key="item">
        <el-image
          :src="'http://wphoto.top/' + item"
          :zoom-rate="1.2"
          :preview-src-list="srcList"
          :initial-index="4"
          fit="cover"
        />
        <img :src="'http://wphoto.top/' + item" alt="" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
const imgArr = ['FoR0aljkHucHnqcVjK7Cm8e5oX_-', 'FgbtYMZJuNGwxmOl6AO5SPvHOZYj'];
const srcList = [
  'http://wphoto.top/FoR0aljkHucHnqcVjK7Cm8e5oX_-',
  'http://wphoto.top/FgbtYMZJuNGwxmOl6AO5SPvHOZYj',
];
</script>

<style scoped>
.el-carousel__item img {
  margin: 0;
  width: 100%;
  height: 100%;
}
.setPhotoSize {
  width: 100vw;
  height: 600px;
  background-size: cover;
}
/*
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
} */
</style>

<template>
  <el-config-provider :locale="locale">
    <div class="main_container">
      <div class="block">
        <el-date-picker v-model="monthValue" type="month" placeholder="选择花期月份" />
      </div>
      <div class="photo_c">
        <div class="photo_m" v-for="itme in 3"></div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ref } from 'vue';

const locale = ref(zhCn);
const monthValue = ref('');
</script>

<style scoped>
.main_container {
  position: relative;
}
.photo_c {
  margin-top: 20px;
  border-radius: 10px;
  border: 1px solid #ded2d2;
}
</style>
